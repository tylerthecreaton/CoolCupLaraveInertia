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
        $ingredientLots = IngredientLot::with('ingredient')
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($lot) {
                return $lot->created_at->format('Y-m-d');
            })
            ->map(function ($lots) {
                $firstLot = $lots->first();
                return [
                    'id' => $firstLot->id,
                    'created_at' => $firstLot->created_at,
                    'items_count' => $lots->count(),
                    'items' => $lots->map(function ($lot) {
                        return [
                            'id' => $lot->id,
                            'name' => $lot->ingredient->name,
                            'quantity' => $lot->quantity,
                        ];
                    }),
                ];
            })
            ->values();

        $consumableLots = ConsumableLot::with('consumable')
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get()
            ->groupBy(function ($lot) {
                return $lot->created_at->format('Y-m-d');
            })
            ->map(function ($lots) {
                $firstLot = $lots->first();
                return [
                    'id' => $firstLot->id,
                    'created_at' => $firstLot->created_at,
                    'items_count' => $lots->count(),
                    'items' => $lots->map(function ($lot) {
                        return [
                            'id' => $lot->id,
                            'name' => $lot->consumable->name,
                            'quantity' => $lot->quantity,
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
