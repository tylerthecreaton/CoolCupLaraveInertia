<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductConsumables;
use Illuminate\Http\Request;

class ProductConsumablesController extends Controller
{
    public function batchUpdate(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'consumables' => 'required|array',
            'consumables.*.consumable_id' => 'required|exists:consumables,id',
            'consumables.*.quantity_used' => 'required|numeric|min:0',
        ], [
            'product_id.required' => 'กรุณาระบุสินค้า',
            'product_id.exists' => 'ไม่พบสินค้าที่ระบุ',
            'consumables.required' => 'กรุณาระบุวัตถุดิบสิ้นเปลือง',
            'consumables.array' => 'ข้อมูลวัตถุดิบสิ้นเปลืองไม่ถูกต้อง',
            'consumables.*.consumable_id.required' => 'กรุณาระบุวัตถุดิบสิ้นเปลือง',
            'consumables.*.consumable_id.exists' => 'ไม่พบวัตถุดิบสิ้นเปลืองที่ระบุ',
            'consumables.*.quantity_used.required' => 'กรุณาระบุปริมาณที่ใช้',
            'consumables.*.quantity_used.numeric' => 'ปริมาณที่ใช้ต้องเป็นตัวเลข',
            'consumables.*.quantity_used.min' => 'ปริมาณที่ใช้ต้องมากกว่า 0',
        ]);

        $product = Product::findOrFail($request->product_id);
        
        // ลบข้อมูลวัตถุดิบสิ้นเปลืองเดิมทั้งหมด
        $product->consumables()->delete();
        
        // เพิ่มข้อมูลวัตถุดิบสิ้นเปลืองใหม่
        foreach ($request->consumables as $consumable) {
            if (!isset($consumable['id'])) {
                $product->consumables()->create([
                    'consumable_id' => $consumable['consumable_id'],
                    'quantity_used' => $consumable['quantity_used'],
                ]);
            }
        }

        return back();
    }
}
