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
        $request->validate([
            'items' => 'required|array',
            'items.*.lot_id' => 'required|integer',
            'items.*.type' => 'required|in:ingredient,consumable',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.transformer_id' => 'nullable|integer'
        ]);

        try {
            DB::transaction(function () use ($request) {
                $withdraw = Withdraw::create([
                    'user_id' => Auth::id(),
                    'status' => 'completed',
                    'note' => $request->note
                ]);

                foreach ($request->items as $item) {
                    $withdrawItem = new WithdrawItem([
                        'type' => $item['type'],
                        'quantity' => $item['quantity'],
                        'transformer_id' => $item['transformer_id'] ?? null
                    ]);

                    if ($item['type'] === 'ingredient') {
                        $lot = IngredientLot::with('details.ingredient')->findOrFail($item['lot_id']);
                        $withdrawItem->ingredient_lot_id = $lot->id;

                        $ingredientDetail = $lot->details->first();
                        if ($ingredientDetail) {
                            $ingredient = $ingredientDetail->ingredient;
                            $decreaseAmount = $item['quantity'];

                            if (isset($item['transformer_id'])) {
                                $transformer = $ingredient->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $decreaseAmount *= $transformer->multiplier;
                                }
                            }

                            $ingredient->decrement('quantity', $decreaseAmount);
                            $withdrawItem->unit = $ingredient->unit ? $ingredient->unit->name : null;
                        }
                    } else {
                        $lot = ConsumableLot::with('details.consumable')->findOrFail($item['lot_id']);
                        $withdrawItem->consumable_lot_id = $lot->id;

                        $consumableDetail = $lot->details->first();
                        if ($consumableDetail) {
                            $consumable = $consumableDetail->consumable;
                            $decreaseAmount = $item['quantity'];

                            if (isset($item['transformer_id'])) {
                                $transformer = $consumable->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $decreaseAmount *= $transformer->multiplier;
                                }
                            }

                            $consumable->decrement('quantity', $decreaseAmount);
                            $withdrawItem->unit = $consumable->unit ? $consumable->unit->name : null;
                        }
                    }

                    $withdraw->items()->save($withdrawItem);
                }
            });

            return redirect()->route('admin.withdraw.index')
                ->with('success', 'บันทึกการเบิกสำเร็จ');
        } catch (\Exception $e) {
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
                            $returnAmount = $item->quantity;

                            if ($item->transformer_id) {
                                $transformer = $ingredient->transformers()->find($item->transformer_id);
                                if ($transformer) {
                                    $returnAmount *= $transformer->multiplier;
                                }
                            }

                            $ingredient->increment('quantity', $returnAmount);
                        }
                    } else {
                        $consumableDetail = $item->consumableLot->details->first();
                        if ($consumableDetail) {
                            $consumable = $consumableDetail->consumable;
                            $returnAmount = $item->quantity;

                            if ($item->transformer_id) {
                                $transformer = $consumable->transformers()->find($item->transformer_id);
                                if ($transformer) {
                                    $returnAmount *= $transformer->multiplier;
                                }
                            }

                            $consumable->increment('quantity', $returnAmount);
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
