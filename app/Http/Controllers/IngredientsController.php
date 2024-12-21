<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Inertia;

class IngredientsController extends Controller
{
    public function index()
    {
        return Inertia::render('Ingredients/Index');
    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'stock' => ['required', 'numeric'],
        ]);

        $ingredient = new Ingredient();
        $ingredient->name = $request->name;
        $ingredient->description = $request->description;
        $ingredient->price = $request->price;
        $ingredient->stock = $request->stock;
        $ingredient->save();
        return redirect()->route('ingredients.index')->with('success','');
    }
    public function show($id)
    {
        $ingredient = Ingredient::find($id);
        return Inertia::render('Ingredients/Show', compact('ingredient'));
    }
    public function edit($id)
    {
        $ingredient = Ingredient::find($id);
        return Inertia::render('Ingredients/Edit', compact('ingredient'));
    }
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric'],
            'stock' => ['required', 'numeric'],
        ]);

        $ingredient = Ingredient::find($id);
        $ingredient->name = $request->name;
        $ingredient->description = $request->description;
        $ingredient->price = $request->price;
        $ingredient->stock = $request->stock;
        $ingredient->save();
        return redirect()->route('ingredients.index')->with('success','');
    }
    public function destroy($id)
    {
        $ingredient = Ingredient::find($id);
        $ingredient->delete();
        return redirect()->route('ingredients.index')->with('success','');
    }
}
