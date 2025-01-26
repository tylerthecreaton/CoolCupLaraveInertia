<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ConsumableLot;
use App\Models\IngredientLot;
use App\Models\Withdraws;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WithdrawController extends Controller
{
    public function index()
    {
        $withdraws = Withdraws::with(['consumableLot', 'ingredientLot', 'user'])->paginate(10);
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
        $withdraw = Withdraws::findOrFail($id);
        return Inertia::render('Admin/withdraw/show', compact('withdraw'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.type' => 'required|in:ingredient,consumable',
            'items.*.lot_id' => 'required|integer',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.transformer_id' => 'nullable|exists:transformers,id',
        ]);

        try {
            \DB::transaction(function () use ($request) {
                foreach ($request->items as $item) {
                    $withdraw = new Withdraws([
                        'user_id' => auth()->id(),
                        'quantity' => $item['quantity'],
                        'status' => 'completed'
                    ]);

                    if ($item['type'] === 'ingredient') {
                        $lot = IngredientLot::with('details.ingredient')->findOrFail($item['lot_id']);
                        $withdraw->ingredient_lot_id = $lot->id;

                        // Find the ingredient detail in the lot
                        $ingredientDetail = $lot->details->first();
                        if ($ingredientDetail) {
                            // Get the ingredient
                            $ingredient = $ingredientDetail->ingredient;

                            // Calculate the quantity to decrease
                            $decreaseAmount = $item['quantity'];
                            if (isset($item['transformer_id'])) {
                                $transformer = $ingredient->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $decreaseAmount *= $transformer->multiplier;
                                }
                            }

                            // Update the ingredient quantity
                            $ingredient->decrement('quantity', $decreaseAmount);

                            // Add unit information to the withdraw record
                            $withdraw->unit = $ingredient->unit ? $ingredient->unit->name : null;
                        }
                    } else {
                        $lot = ConsumableLot::with('details.consumable')->findOrFail($item['lot_id']);
                        $withdraw->consumable_lot_id = $lot->id;

                        // Find the consumable detail in the lot
                        $consumableDetail = $lot->details->first();
                        if ($consumableDetail) {
                            // Get the consumable
                            $consumable = $consumableDetail->consumable;

                            // Calculate the quantity to decrease
                            $decreaseAmount = $item['quantity'];
                            if (isset($item['transformer_id'])) {
                                $transformer = $consumable->transformers()->find($item['transformer_id']);
                                if ($transformer) {
                                    $decreaseAmount *= $transformer->multiplier;
                                }
                            }

                            // Update the consumable quantity
                            $consumable->decrement('quantity', $decreaseAmount);

                            // Add unit information to the withdraw record
                            $withdraw->unit = $consumable->unit ? $consumable->unit->name : null;
                        }
                    }

                    $withdraw->save();
                }
            });

            return redirect()->route('admin.withdraw.index')
                ->with('success', 'บันทึกการเบิกสำเร็จ');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'เกิดข้อผิดพลาด: ' . $e->getMessage());
        }
    }

    public function rollback($id)
    {
        $withdraw = Withdraws::findOrFail($id);
        return Inertia::render('Admin/withdraw/rollback', compact('withdraw'));
    }
}
