<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transformer;
use App\Models\Ingredient;
use App\Models\Consumable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

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
            'type' => 'required|in:ingredient,consumable',
            'multiplier' => 'required|numeric',
            'ingredient_id' => [
                'nullable',
                'exists:ingredients,id',
                Rule::requiredIf(function () use ($request) {
                    return $request->type === 'ingredient';
                }),
            ],
            'consumable_id' => [
                'nullable',
                'exists:consumables,id',
                Rule::requiredIf(function () use ($request) {
                    return $request->type === 'consumable';
                }),
            ],
        ], [
            'ingredient_id.required_if' => 'กรุณาเลือกวัตถุดิบที่จะแปรรูป',
            'consumable_id.required_if' => 'กรุณาเลือกวัตถุดิบสิ้นเปลืองที่จะแปรรูป',
        ]);

        Transformer::create($validated);

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer created successfully.');
    }

    public function edit($id)
    {
        $transformer = Transformer::findOrFail($id);
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
            'type' => 'required|in:ingredient,consumable',
            'multiplier' => 'required|numeric',
            'ingredient_id' => [
                'nullable',
                'exists:ingredients,id',
                Rule::requiredIf(function () use ($request) {
                    return $request->type === 'ingredient';
                }),
            ],
            'consumable_id' => [
                'nullable',
                'exists:consumables,id',
                Rule::requiredIf(function () use ($request) {
                    return $request->type === 'consumable';
                }),
            ],
        ], [
            'ingredient_id.required_if' => 'กรุณาเลือกวัตถุดิบที่จะแปรรูป',
            'consumable_id.required_if' => 'กรุณาเลือกวัตถุดิบสิ้นเปลืองที่จะแปรรูป',
        ]);

        $transformer->update($validated);

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer updated successfully.');
    }

    public function destroy($id)
    {
        $transformer = Transformer::findOrFail($id);
        $transformer->delete();

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer deleted successfully.');
    }
}
