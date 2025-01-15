<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientLotController extends Controller
{
    public function index()
    {
        $ingredients = Ingredient::with('unit')->get();
        return Inertia::render('Admin/ingredientLot/index', [
            'ingredients' => $ingredients,
        ]);
    }

    public function store(Request $request) {}
}
