<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function promotions()
    {
        $promotions = Promotion::where('start_date', '<=', date('Y-m-d'))
            ->where('end_date', '>=', date('Y-m-d'))
            ->where('is_active', 1)->OrderBy('id', 'desc')->get();
        return $promotions;
    }

    public function index()
    {
        $currentDate = now();
        $promotions = Promotion::orderBy('id', 'desc')
            ->get()
            ->map(function ($promotion) use ($currentDate) {
                $startDate = \Carbon\Carbon::parse($promotion->start_date);
                $endDate = \Carbon\Carbon::parse($promotion->end_date);
                
                if (!$promotion->is_active) {
                    $promotion->status = 'inactive';
                } else if ($currentDate->gt($endDate)) {
                    $promotion->status = 'expired';
                } else if ($currentDate->lt($startDate)) {
                    $promotion->status = 'inactive';
                } else {
                    $promotion->status = 'active';
                }
                
                return $promotion;
            });

        return Inertia::render('Admin/promotions/index', [
            'promotions' => $promotions
        ]);
    }
}
