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
        Log::info('Withdraw request payload:', $request->all());

        $request->validate([
            'items' => 'required|array',
            'items.*.type' => 'required|in:ingredient,consumable',
            'items.*.lot_id' => 'required|integer',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.transformer_id' => 'nullable|integer'
        ]);

        try {
            DB::transaction(function () use ($request) {
                Log::info('Creating withdraw record');
                
                $withdraw = Withdraw::create([
                    'user_id' => Auth::id(),
                    'status' => 'completed',
                    'note' => $request->note ?? null
                ]);

                Log::info('Created withdraw record:', ['withdraw_id' => $withdraw->id]);

                foreach ($request->items as $item) {
                    Log::info('Processing item:', $item);
                    
                    $withdrawItem = new WithdrawItem([
                        'type' => $item['type'],
                        'quantity' => $item['quantity'],
                        'transformer_id' => $item['transformer_id'] ?? null
                    ]);

                    if ($item['type'] === 'ingredient') {
                        $lot = IngredientLot::with(['details.ingredient', 'details.ingredient.unit'])->findOrFail($item['lot_id']);
                        $withdrawItem->ingredient_lot_id = $lot->id;
                        
                        $ingredientDetail = $lot->details->first();
                        if ($ingredientDetail) {
                            $ingredient = $ingredientDetail->ingredient;
                            $addAmount = $item['quantity'];
                            
                            if (!empty($item['transformer_id'])) {
                                $transformer = $ingredient->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $addAmount *= floatval($transformer->multiplier);
                                    Log::info('Applied transformer multiplier:', [
                                        'original_amount' => $item['quantity'],
                                        'multiplier' => $transformer->multiplier,
                                        'final_amount' => $addAmount
                                    ]);
                                }
                            }
                            
                            $ingredient->increment('quantity', $addAmount);
                            $withdrawItem->unit = optional($ingredient->unit)->name;
                            
                            Log::info('Updated ingredient quantity:', [
                                'ingredient_id' => $ingredient->id,
                                'added_amount' => $addAmount,
                                'new_quantity' => $ingredient->quantity,
                                'unit' => $withdrawItem->unit
                            ]);
                        }
                    } else {
                        $lot = ConsumableLot::with(['details.consumable'])->findOrFail($item['lot_id']);
                        $withdrawItem->consumable_lot_id = $lot->id;
                        
                        $consumableDetail = $lot->details->first();
                        if ($consumableDetail) {
                            $consumable = $consumableDetail->consumable;
                            $addAmount = $item['quantity'];
                            
                            if (!empty($item['transformer_id'])) {
                                $transformer = $consumable->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $addAmount *= floatval($transformer->multiplier);
                                    Log::info('Applied transformer multiplier:', [
                                        'original_amount' => $item['quantity'],
                                        'multiplier' => $transformer->multiplier,
                                        'final_amount' => $addAmount
                                    ]);
                                }
                            }
                            
                            $consumable->increment('quantity', $addAmount);
                            $withdrawItem->unit = $consumable->unit;
                            
                            Log::info('Updated consumable quantity:', [
                                'consumable_id' => $consumable->id,
                                'added_amount' => $addAmount,
                                'new_quantity' => $consumable->quantity,
                                'unit' => $withdrawItem->unit
                            ]);
                        }
                    }

                    $withdraw->items()->save($withdrawItem);
                    Log::info('Saved withdraw item:', ['withdraw_item_id' => $withdrawItem->id]);
                }
            });

            Log::info('Transaction completed successfully');
            return redirect()->route('admin.withdraw.index')
                ->with('success', 'บันทึกการเบิกสำเร็จ');
        } catch (\Exception $e) {
            Log::error('Error in withdraw store:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()
                ->with('error', 'เกิดข้อผิดพลาด: ' . $e->getMessage());
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
                            $subtractAmount = $item->quantity;

                            if ($item->transformer_id) {
                                $transformer = $ingredient->transformers()->find($item->transformer_id);
                                if ($transformer) {
                                    $subtractAmount *= $transformer->multiplier;
                                }
                            }

                            $ingredient->decrement('quantity', $subtractAmount);
                        }
                    } else {
                        $consumableDetail = $item->consumableLot->details->first();
                        if ($consumableDetail) {
                            $consumable = $consumableDetail->consumable;
                            $subtractAmount = $item->quantity;

                            if ($item->transformer_id) {
                                $transformer = $consumable->transformers()->find($item->transformer_id);
                                if ($transformer) {
                                    $subtractAmount *= $transformer->multiplier;
                                }
                            }

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
