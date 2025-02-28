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
        $transformers = Transformer::with([
            'ingredient.unit:id,name',
            'consumable.unit:id,name'
        ])->latest()->paginate(10);
        
        return Inertia::render('Admin/transformer/Index', [
            'transformers' => $transformers
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/transformer/Create', [
            'ingredients' => Ingredient::with('unit:id,name')->select('id', 'name', 'unit_id')->get(),
            'consumables' => Consumable::with('unit:id,name')->select('id', 'name', 'unit_id')->get()
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255|min:3',
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
        ];
        $messages = [
            'name.required' => 'กรุณากรอกชื่อ',
            'name.max' => 'ชื่อสินค้าต้องมีความยาวอย่างน้อย :max ตัวอักษร',
            'name.min' => 'ชื่อสินค้าต้องมีความยาวอย่างน้อย :min ตัวอักษร',
            'type.required' => 'กรุณาเลือกประเภทวัตถุดิบ',
            'type.in' => 'กรุณาเลือกประเภทวัตถุดิบ',
            'multiplier.required' => 'กรุณากรอกค่าคูณ',
            'multiplier.numeric' => 'กรุณากรอกค่าคูณ',
            'ingredient_id.required_if' => 'กรุณาเลือกวัตถุดิบที่จะแปรรูป',
            'consumable_id.required_if' => 'กรุณาเลือกวัตถุดิบสิ้นเปลืองที่จะแปรรูป',
        ];
        $request->validate($rules, $messages);

        $validated = $request->validate($rules);

        Transformer::create($validated);

        return redirect()->route('admin.transformers.index')
            ->with('message', 'Transformer created successfully.');
    }

    public function edit($id)
    {
        $transformer = Transformer::findOrFail($id);
        return Inertia::render('Admin/transformer/Edit', [
            'transformer' => $transformer->load(['ingredient', 'consumable']),
            'ingredients' => Ingredient::with('unit:id,name')->select('id', 'name', 'unit_id')->get(),
            'consumables' => Consumable::with('unit:id,name')->select('id', 'name', 'unit_id')->get()
        ]);
    }

    public function update(Request $request, Transformer $transformer)
    {
        $rules = [
            'name' => 'required|string|max:255|min:3',
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
        ];
        $messages = [
            'name.required' => 'กรุณากรอกชื่อ',
            'name.max' => 'ชื่อสินค้าต้องมีความยาวอย่างน้อย :max ตัวอักษร',
            'name.min' => 'ชื่อสินค้าต้องมีความยาวอย่างน้อย :min ตัวอักษร',
            'type.required' => 'กรุณาเลือกประเภทวัตถุดิบ',
            'type.in' => 'กรุณาเลือกประเภทวัตถุดิบ',
            'multiplier.required' => 'กรุณากรอกค่าคูณ',
            'multiplier.numeric' => 'กรุณากรอกค่าคูณ',
            'ingredient_id.required_if' => 'กรุณาเลือกวัตถุดิบที่จะแปรรูป',
            'consumable_id.required_if' => 'กรุณาเลือกวัตถุดิบสิ้นเปลืองที่จะแปรรูป',
        ];
        $request->validate($rules, $messages);
        $validated = $request->validate($rules);
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
