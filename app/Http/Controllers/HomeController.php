<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $products = Product::limit(10)->get(); // TODO: please load popular products here the future.
        $categories = Category::with(relations: 'products')->get();
        return Inertia::render('Home', [
            'categories' => $categories,
            'products' => $products,
        ]);
    }
}
