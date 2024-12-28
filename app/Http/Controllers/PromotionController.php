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
