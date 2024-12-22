<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Ingredient;
use App\Models\ProductIngredients;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductIngredientController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'ingredient_id' => 'required|exists:ingredients,id',
            'quantity_used' => 'required|numeric|min:0',
        ]);

        $product = Product::findOrFail($request->product_id);
        $product->getIngredients()->attach($request->ingredient_id, [
            'quantity_used' => $request->quantity_used
        ]);

        return back()->with('success', 'เพิ่มวัตถุดิบสำเร็จ');
    }

    public function update(Request $request, ProductIngredients $productIngredient)
    {
        $request->validate([
            'quantity_used' => 'required|numeric|min:0',
        ]);

        $productIngredient->update([
            'quantity_used' => $request->quantity_used
        ]);

        return back()->with('success', 'อัพเดทปริมาณวัตถุดิบสำเร็จ');
    }

    public function destroy(ProductIngredients $productIngredient)
    {
        $productIngredient->delete();
        return back()->with('success', 'ลบวัตถุดิบออกจากสูตรสำเร็จ');
    }
}
