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
        $ingredients = IngredientLot::with('ingredient')
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'name' => $lot->ingredient->name,
                    'quantity' => $lot->quantity,
                    'created_at' => $lot->created_at
                ];
            });

        $consumables = ConsumableLot::with('consumable')
            ->where('quantity', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($lot) {
                return [
                    'id' => $lot->id,
                    'name' => $lot->consumable->name,
                    'quantity' => $lot->quantity,
                    'created_at' => $lot->created_at
                ];
            });

        return Inertia::render('Admin/withdraw/create', compact('ingredients', 'consumables'));
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
