<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PromotionController extends Controller
{
    public function promotions()
    {
        $promotions = Promotion::OrderBy('id', 'desc')->get();
        return $promotions;
    }

    public function index()
    {
        $promotions = Promotion::where('start_date', '<=', date('Y-m-d'))
            ->where('end_date', '>=', date('Y-m-d'))
            ->get();
        $promotion_types = [
            ['BUY_X_GET_Y' => 'ซื้อ x รับ y'],
            ['PERCENTAGE' => 'เปอร์เซ็นต์'],
            ['FIXED' => 'ค่าคงที่'],
            ['CATEGORY_DISCOUNT' => 'ส่วนลดสําหรับหมวดหมู่']
        ];

        return Inertia::render('Promotion', [
            'promotions' => $promotions,
            'types' => $promotion_types
        ]);
    }
}
