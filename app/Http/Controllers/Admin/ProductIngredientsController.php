<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductIngredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProductIngredientsController extends Controller
{
    public function batchUpdate(Request $request)
    {
        Log::debug('ProductIngredientsController@batchUpdate: Start');
        Log::debug('Request data:', $request->all());

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'ingredients' => 'required|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity_size_s' => 'required|numeric|min:0',
            'ingredients.*.quantity_size_m' => 'required|numeric|min:0',
            'ingredients.*.quantity_size_l' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            // Get the product
            $product = Product::findOrFail($request->product_id);
            Log::debug('Found product:', ['id' => $product->id]);

            // Delete existing ingredients not in the new list
            $newIngredientIds = collect($request->ingredients)
                ->pluck('ingredient_id')
                ->toArray();
            Log::debug('New ingredient IDs:', $newIngredientIds);

            ProductIngredient::where('product_id', $product->id)
                ->whereNotIn('ingredient_id', $newIngredientIds)
                ->delete();

            // Update or create ingredients
            foreach ($request->ingredients as $ingredient) {
                Log::debug('Processing ingredient:', $ingredient);

                $result = ProductIngredient::updateOrCreate(
                    [
                        'product_id' => $product->id,
                        'ingredient_id' => $ingredient['ingredient_id'],
                    ],
                    [
                        'quantity_used' => 0,
                        'quantity_size_s' => $ingredient['quantity_size_s'],
                        'quantity_size_m' => $ingredient['quantity_size_m'],
                        'quantity_size_l' => $ingredient['quantity_size_l'],
                    ]
                );
                Log::debug('Ingredient saved:', $result->toArray());
            }

            DB::commit();
            Log::debug('ProductIngredientsController@batchUpdate: Success');

            return redirect()->back()->with('success', 'วัตถุดิบได้รับการอัปเดตเรียบร้อยแล้ว');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('ProductIngredientsController@batchUpdate Error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'เกิดข้อผิดพลาดในการอัปเดตวัตถุดิบ');
        }
    }
}
