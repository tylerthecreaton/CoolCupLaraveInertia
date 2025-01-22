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
            })
            ->values();
        $consumableLots = ConsumableLot::with(['details.consumable'])
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($lots) {
                $lotsDetails = $lots->details;
                foreach ($lotsDetails as $detail) {
                    $detail->consumable->unit = $detail->consumable->unit ? $detail->consumable->unit : null;
                }

                return [
                    'id' => $lots->id,
                    'created_at' => $lots->created_at,
                    'items_count' => $lotsDetails->count(),
                    'items' => $lotsDetails->map(function ($detail) {
                        return [
                            'id' => $detail->id,
                            'name' => $detail->consumable->name,
                            'quantity' => $detail->quantity,
                        ];
                    }),
                ];
            })
            ->values();

        return Inertia::render('Admin/withdraw/create', [
            'ingredients' => $ingredientLots,
            'consumables' => $consumableLots,
        ]);
    }

    public function show($id)
    {
        $withdraw = Withdraws::findOrFail($id);
        return Inertia::render('Admin/withdraw/show', compact('withdraw'));
    }

    public function store(Request $request) {}

    public function rollback($id)
    {
        $withdraw = Withdraws::findOrFail($id);
        return Inertia::render('Admin/withdraw/rollback', compact('withdraw'));
    }
}
