<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Ingredient;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class HomeController extends Controller
{
    public function index()
    {
        $products = Product::with(['ingredients' => function ($query) {
            $query->join('ingredients', 'product_ingredients.ingredient_id', '=', 'ingredients.id')
                ->join('units', 'ingredients.unit_id', '=', 'units.id')
                ->select(
                    'ingredients.*',
                    'product_ingredients.product_id',
                    'product_ingredients.quantity_used',
                    'product_ingredients.ingredient_id',
                    'units.name as unit_name'
                );
        }])
            ->leftJoin('order_details', 'products.id', '=', 'order_details.product_id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('categories.name', '!=', 'ท๊อปปิ้ง')
            ->select('products.*')
            ->selectRaw('COALESCE(SUM(order_details.quantity), 0) as total_sales')
            ->groupBy(
                'products.id',
                'products.name',
                'products.description',
                'products.cost_price',
                'products.sale_price',
                'products.image',
                'products.category_id',
                'products.created_at',
                'products.updated_at'
            )
            ->orderBy('total_sales', 'desc')
            ->limit(10)
            ->get();

        $categories = Category::with(['products' => function ($query) {
            $query->with(['ingredients' => function ($query) {
                $query->join('ingredients', 'product_ingredients.ingredient_id', '=', 'ingredients.id')
                    ->join('units', 'ingredients.unit_id', '=', 'units.id')
                    ->select(
                        'ingredients.*',
                        'product_ingredients.product_id',
                        'product_ingredients.quantity_used',
                        'product_ingredients.ingredient_id',
                        'units.name as unit_name'
                    );
            }])
                ->leftJoin('order_details', 'products.id', '=', 'order_details.product_id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->where('categories.name', '!=', 'Topping')
                ->select('products.*')
                ->selectRaw('COALESCE(SUM(order_details.quantity), 0) as total_sales')
                ->groupBy(
                    'products.id',
                    'products.name',
                    'products.description',
                    'products.cost_price',
                    'products.sale_price',
                    'products.image',
                    'products.category_id',
                    'products.created_at',
                    'products.updated_at'
                )
                ->orderBy('total_sales', 'desc');
        }])->get();

        // Log sample product data for debugging
        Log::info('Sample product data:', [
            'first_product' => $products->first() ? [
                'id' => $products->first()->id,
                'name' => $products->first()->name,
                'ingredients' => $products->first()->ingredients->map(fn($i) => [
                    'id' => $i->id,
                    'name' => $i->name,
                    'quantity' => $i->quantity,
                    'quantity_used' => $i->quantity_used,
                    'unit_name' => $i->unit_name,
                ])
            ] : null
        ]);

        return Inertia::render('Home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
