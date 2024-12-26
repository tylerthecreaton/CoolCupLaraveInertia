<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function index()
    {
        $promotions = Promotion::all();
        $promotion_types = Promotion::select('type')->distinct()->get();

        return Inertia::render('Promotion', [
            'promotions' => $promotions,
            'types' => $promotion_types
        ]);
    }
}
