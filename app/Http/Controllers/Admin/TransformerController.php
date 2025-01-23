<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transformer;
use App\Models\Ingredient;
use App\Models\Consumable;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransformerController extends Controller
{
    public function index()
    {
        $transformers = Transformer::with(['ingredient', 'consumable'])->latest()->paginate(10);
        return Inertia::render('Admin/transformer/Index', [
            'transformers' => $transformers
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/transformer/Create', [
            'ingredients' => Ingredient::select('id', 'name')->get(),
            'consumables' => Consumable::select('id', 'name')->get()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ingredient_id' => 'exists:ingredients,id|nullable',
            'consumable_id' => 'exists:consumables,id|nullable',
            'multiplier' => 'required|numeric'
        ]);

        Transformer::create($validated);

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer created successfully.');
    }

    public function edit(Transformer $transformer)
    {
        return Inertia::render('Admin/transformer/Edit', [
            'transformer' => $transformer->load(['ingredient', 'consumable']),
            'ingredients' => Ingredient::select('id', 'name')->get(),
            'consumables' => Consumable::select('id', 'name')->get()
        ]);
    }

    public function update(Request $request, Transformer $transformer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'ingredient_id' => 'exists:ingredients,id|nullable',
            'consumable_id' => 'exists:consumables,id|nullable',
            'multiplier' => 'required|numeric'
        ]);

        $transformer->update($validated);

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer updated successfully.');
    }

    public function destroy(Transformer $transformer)
    {
        $transformer->delete();

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer deleted successfully.');
    }
}
