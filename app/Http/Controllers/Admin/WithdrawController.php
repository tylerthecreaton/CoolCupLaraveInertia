<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsumableLot;
use App\Models\IngredientLot;
use App\Models\Withdraw;
use App\Models\WithdrawItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class WithdrawController extends Controller
{
    public function index()
    {
        $withdraws = Withdraw::with([
            'items.ingredientLot.details.ingredient',
            'items.consumableLot.details.consumable',
            'items.transformer',
            'user'
        ])
            ->latest()
            ->paginate(10);
        return Inertia::render('Admin/withdraw/index', compact('withdraws'));
    }

    public function create()
    {
        // ดึง lots พร้อมข้อมูล ingredient
        $ingredientLots = IngredientLot::with(['details.ingredient.unit', 'details.ingredient.transformers'])
            ->whereHas('details', function($query) {
                $query->where('quantity', '>', 0);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($lots) {
                $lotsDetails = $lots->details;
                foreach ($lotsDetails as $detail) {
                    $detail->ingredient->unit = $detail->ingredient->unit ? $detail->ingredient->unit : null;
                }
                return [
                    'id' => $lots->id,
                    'created_at' => $lots->created_at,
                    'items_count' => $lotsDetails->count(),
                    'items' => $lotsDetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'name' => $detail->ingredient->name,
                            'quantity' => $detail->quantity,
                            'unit' => $detail->ingredient->unit ? $detail->ingredient->unit->name : null,
                            'transformers' => $detail->ingredient->transformers->map(function ($transformer) {
                                return [
                                    'id' => $transformer->id,
                                    'name' => $transformer->name,
                                    'description' => $transformer->description,
                                    'multiplier' => $transformer->multiplier,
                                ];
                            }),
                        ];
                    }),
                ];
            });

        // ดึง lots พร้อมข้อมูล consumable และ transformers
        $consumableLots = ConsumableLot::with(['details.consumable.transformers'])
            ->whereHas('details', function($query) {
                $query->where('quantity', '>', 0);
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($lots) {
                return [
                    'id' => $lots->id,
                    'created_at' => $lots->created_at,
                    'items' => $lots->details->map(function ($detail) use ($lots) {
                        return [
                            'lot_id' => $lots->id,
                            'lot_created_at' => $lots->created_at,
                            'id' => $detail->id,
                            'name' => $detail->consumable->name,
                            'quantity' => $detail->quantity,
                            'transformers' => $detail->consumable->transformers->map(function ($transformer) {
                                return [
                                    'id' => $transformer->id,
                                    'name' => $transformer->name,
                                    'description' => $transformer->description,
                                    'multiplier' => $transformer->multiplier,
                                ];
                            }),
                        ];
                    }),
                ];
            })
            ->reduce(function ($result, $lot) {
                foreach ($lot['items'] as $item) {
                    $itemName = $item['name'];
                    if (!isset($result[$itemName])) {
                        $result[$itemName] = [
                            'name' => $itemName,
                            'items' => [],
                        ];
                    }
                    $result[$itemName]['items'][] = $item;
                }
                return $result;
            }, []);

        return Inertia::render('Admin/withdraw/create', [
            'ingredientLots' => $ingredientLots,
            'consumables' => collect($consumableLots)->values(),
        ]);
    }

    public function show($id)
    {
        $withdraw = Withdraw::findOrFail($id);
        return Inertia::render('Admin/withdraw/show', compact('withdraw'));
    }

    public function store(Request $request)
    {
        try {
            Log::info('Withdraw request data:', $request->all());
            
            $request->validate([
                'items' => 'required|array',
                'items.*.type' => 'required|in:ingredient,consumable',
                'items.*.lot_id' => 'required|integer',
                'items.*.quantity' => 'required|numeric|min:0.01',
                'items.*.transformer_id' => 'nullable|integer'
            ]);

            DB::beginTransaction();
            try {
                $withdraw = Withdraw::create([
                    'user_id' => Auth::id(),
                    'status' => 'completed',
                    'note' => $request->note ?? null
                ]);

                Log::info('Created withdraw:', ['id' => $withdraw->id]);

                foreach ($request->items as $item) {
                    Log::info('Processing item:', $item);
                    
                    $withdrawItem = new WithdrawItem([
                        'type' => $item['type'],
                        'quantity' => $item['quantity'],
                        'transformer_id' => $item['transformer_id'] ?? null
                    ]);

                    Log::info('Created withdraw item:', $withdrawItem->toArray());

                    if ($item['type'] === 'ingredient') {
                        $lot = IngredientLot::with(['details.ingredient', 'details.ingredient.unit'])->findOrFail($item['lot_id']);
                        $withdrawItem->ingredient_lot_id = $lot->id;

                        Log::info('Found ingredient lot:', ['lot_id' => $lot->id]);

                        $ingredientDetail = $lot->details->first();
                        if ($ingredientDetail) {
                            $ingredient = $ingredientDetail->ingredient;
                            $withdrawAmount = $item['quantity'];
                            $addAmount = $withdrawAmount;

                            if (!empty($item['transformer_id'])) {
                                $transformer = $ingredient->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $addAmount *= floatval($transformer->multiplier);
                                    Log::info('Applied transformer:', [
                                        'transformer_id' => $transformer->id,
                                        'multiplier' => $transformer->multiplier,
                                        'original_amount' => $withdrawAmount,
                                        'final_amount' => $addAmount
                                    ]);
                                }
                            }

                            // Check if lot has enough stock
                            if ($ingredientDetail->quantity < $withdrawAmount) {
                                throw new \Exception("ไม่มีวัตถุดิบเพียงพอใน Lot นี้");
                            }

                            // Deduct from lot
                            $ingredientDetail->decrement('quantity', $withdrawAmount);
                            Log::info('Deducted from lot:', [
                                'lot_id' => $lot->id,
                                'amount' => $withdrawAmount,
                                'new_quantity' => $ingredientDetail->quantity
                            ]);

                            // Add to ingredient total
                            $ingredient->increment('quantity', $addAmount);
                            Log::info('Added to ingredient total:', [
                                'ingredient_id' => $ingredient->id,
                                'amount' => $addAmount,
                                'new_quantity' => $ingredient->quantity
                            ]);

                            // Update expiration date from lot detail
                            $ingredient->update([
                                'expiration_date' => $ingredientDetail->expiration_date
                            ]);

                            $withdrawItem->unit = optional($ingredient->unit)->name;
                            
                            // Save withdraw item
                            try {
                                $withdraw->items()->save($withdrawItem);
                                Log::info('Saved ingredient withdraw item successfully:', [
                                    'withdraw_id' => $withdraw->id,
                                    'withdraw_item_id' => $withdrawItem->id
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Failed to save ingredient withdraw item:', [
                                    'error' => $e->getMessage(),
                                    'withdraw_id' => $withdraw->id,
                                    'withdraw_item' => $withdrawItem->toArray()
                                ]);
                                throw $e;
                            }
                        }
                    } else {
                        $lot = ConsumableLot::with(['details.consumable'])->findOrFail($item['lot_id']);
                        $withdrawItem->consumable_lot_id = $lot->id;

                        $consumableDetail = $lot->details->first();
                        if ($consumableDetail) {
                            $consumable = $consumableDetail->consumable;
                            $withdrawAmount = $item['quantity'];
                            $addAmount = $withdrawAmount;

                            if (!empty($item['transformer_id'])) {
                                $transformer = $consumable->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $addAmount *= floatval($transformer->multiplier);
                                    Log::info('Applied transformer:', [
                                        'transformer_id' => $transformer->id,
                                        'multiplier' => $transformer->multiplier,
                                        'original_amount' => $withdrawAmount,
                                        'final_amount' => $addAmount
                                    ]);
                                }
                            }

                            // Check if lot has enough stock
                            if ($consumableDetail->quantity < $withdrawAmount) {
                                throw new \Exception("ไม่มีวัตถุดิบสิ้นเปลืองเพียงพอใน Lot นี้");
                            }

                            // Deduct from lot
                            $consumableDetail->decrement('quantity', $withdrawAmount);
                            Log::info('Deducted from lot:', [
                                'lot_id' => $lot->id,
                                'amount' => $withdrawAmount,
                                'new_quantity' => $consumableDetail->quantity
                            ]);

                            // Add to consumable total
                            $consumable->increment('quantity', $addAmount);
                            Log::info('Added to consumable total:', [
                                'consumable_id' => $consumable->id,
                                'amount' => $addAmount,
                                'new_quantity' => $consumable->quantity
                            ]);

                            $withdrawItem->unit = $consumable->unit;
                            
                            // Save withdraw item
                            try {
                                $withdraw->items()->save($withdrawItem);
                                Log::info('Saved consumable withdraw item successfully:', [
                                    'withdraw_id' => $withdraw->id,
                                    'withdraw_item_id' => $withdrawItem->id
                                ]);
                            } catch (\Exception $e) {
                                Log::error('Failed to save consumable withdraw item:', [
                                    'error' => $e->getMessage(),
                                    'withdraw_id' => $withdraw->id,
                                    'withdraw_item' => $withdrawItem->toArray()
                                ]);
                                throw $e;
                            }
                        }
                    }
                }

                DB::commit();
                Log::info('Transaction committed successfully');
                return redirect()->route('admin.withdraw.index')->with('success', 'บันทึกการเบิกเรียบร้อยแล้ว');
            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Transaction rolled back:', ['error' => $e->getMessage()]);
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Withdraw store failed:', ['error' => $e->getMessage()]);
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    private function updateLot($withdraw, $type = 'ingredient')
    {
        // อัปเดต lot ตาม items ที่เบิก
    }

    public function rollback($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $withdraw = Withdraw::with([
                    'items.ingredientLot.details.ingredient',
                    'items.consumableLot.details.consumable'
                ])
                    ->findOrFail($id);

                if ($withdraw->status === 'cancelled') {
                    throw new \Exception('การเบิกถูกยกเลิกไปแล้ว');
                }

                foreach ($withdraw->items as $item) {
                    if ($item->type === 'ingredient') {
                        $ingredientDetail = $item->ingredientLot->details->first();
                        if ($ingredientDetail) {
                            $ingredient = $ingredientDetail->ingredient;
                            $returnAmount = $item->quantity;
                            $subtractAmount = $returnAmount;

                            if ($item->transformer_id) {
                                $transformer = $ingredient->transformers()->find($item->transformer_id);
                                if ($transformer) {
                                    $subtractAmount *= $transformer->multiplier;
                                }
                            }

                            // Check if ingredient has enough quantity to return
                            if ($ingredient->quantity < $subtractAmount) {
                                throw new \Exception('ไม่สามารถยกเลิกการเบิกได้ เนื่องจากจำนวนวัตถุดิบคงเหลือไม่เพียงพอ');
                            }

                            // Return to lot
                            $ingredientDetail->increment('quantity', $returnAmount);

                            // Subtract from ingredient total
                            $ingredient->decrement('quantity', $subtractAmount);
                        }
                    } else {
                        $consumableDetail = $item->consumableLot->details->first();
                        if ($consumableDetail) {
                            $consumable = $consumableDetail->consumable;
                            $returnAmount = $item->quantity;
                            $subtractAmount = $returnAmount;

                            if ($item->transformer_id) {
                                $transformer = $consumable->transformers()->find($item->transformer_id);
                                if ($transformer) {
                                    $subtractAmount *= $transformer->multiplier;
                                }
                            }

                            // Check if consumable has enough quantity to return
                            if ($consumable->quantity < $subtractAmount) {
                                throw new \Exception('ไม่สามารถยกเลิกการเบิกได้ เนื่องจากจำนวนวัสดุสิ้นเปลืองคงเหลือไม่เพียงพอ');
                            }

                            // Return to lot
                            $consumableDetail->increment('quantity', $returnAmount);

                            // Subtract from consumable total
                            $consumable->decrement('quantity', $subtractAmount);
                        }
                    }
                }

                $withdraw->status = 'cancelled';
                $withdraw->save();
            });

            return redirect()->route('admin.withdraw.index')
                ->with('success', 'ยกเลิกการเบิกสำเร็จ');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'เกิดข้อผิดพลาด: ' . $e->getMessage());
        }
    }
}
