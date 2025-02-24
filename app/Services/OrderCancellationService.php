<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderCancellation;
use App\Models\Customer;
use App\Models\Expense;
use App\Models\PointUsage;
use App\Models\ProductIngredients;
use App\Models\Ingredient;
use App\Models\Consumable;
use App\Models\ProductConsumables;
use App\Models\ProductIngredientUsage;
use Illuminate\Support\Facades\DB;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderCancellationService
{
    public function cancelOrder(Order $order, array $data)
    {
        try {
            DB::beginTransaction();

            // 1. ตรวจสอบว่า order สามารถยกเลิกได้
            if (!$order->canBeCancelled) {
                throw new Exception('ไม่สามารถยกเลิกคำสั่งซื้อนี้ได้');
            }

            // 2. สร้างรายการยกเลิก
            Log::info("Creating cancellation for order {$order->id}");
            $cancellation = $this->createCancellation($order, $data);

            // 3. อัพเดทสถานะ order
            Log::info("Updating order status for order {$order->id}");
            $order->update(['status' => 'cancelled']);

            // 4. จัดการการคืนวัตถุดิบและอุปกรณ์ (ถ้าสามารถคืนได้)
            if ($data['is_restock_possible']) {
                Log::info("Restocking items for order {$order->id}");
                $restoredItems = $this->restoreStockItems($order);

                $this->updateProductIngredientUsages($restoredItems['restored_ingredients']);

                $cancellation->update([
                    'restored_ingredients' => $restoredItems['restored_ingredients'],
                    'restored_consumables' => $restoredItems['restored_consumables'],
                    'expense_amount' => $data['refunded_amount']
                ]);
            }

            Log::info("คืนคะแนนให้กับลูกค้าในคำสั่งซื้อนี้ {$order->id}");

            // 5. จัดการคะแนนสะสม (ถ้ามี)
            if ($order->customer_id && $order->received_points > 0) {
                Log::info("Refunding points for order {$order->id}");
                $this->refundPoints($order);
            }

            // 6. บันทึกค่าใช้จ่าย (ถ้าจำเป็น)
            Log::info("Recording expense for order {$order->id}");
            $this->createExpenseRecord($order, $data['refunded_amount']);


            DB::commit();
            return $cancellation;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function updateProductIngredientUsages(array $ingredients): void
    {
        try {
            Log::info("Updating product ingredient usages for order {$ingredients[0]['order_id']}");
            foreach ($ingredients as $ingredient) {
                ProductIngredientUsage::create([
                    'order_detail_id' => $ingredient['order_detail_id'],
                    'ingredient_id' => $ingredient['ingredient_id'],
                    'amount' => $ingredient['amount'],
                    'usage_type' => $ingredient['usage_type'],
                    'created_by' => $ingredient['created_by'],
                    'note' => $ingredient['note'],
                ]);
            }
            Log::info("Updated product ingredient usages for order {$ingredient['order_id']}");
        } catch (\Exception $e) {
            Log::error("Error updating product ingredient usages: " . $e->getMessage());
            throw $e;
        }
    }

    private function createCancellation(Order $order, array $data): OrderCancellation
    {
        return OrderCancellation::create([
            'order_id' => $order->id,
            'user_id' => Auth::user()->id,
            'cancellation_reason' => $data['cancellation_reason'],
            'is_restock_possible' => $data['is_restock_possible'],
            'refunded_amount' => $data['refunded_amount'],
            'refunded_discount' => $data['refunded_discount'],
            'refunded_points' => $data['refunded_points'],
        ]);
    }

    private function restoreStockItems(Order $order): array
    {
        $restoredIngredients = [];
        $restoredConsumables = [];

        // วนลูปแต่ละรายการสินค้าในออเดอร์
        foreach ($order->orderDetails as $orderItem) {
            $product = $orderItem->product;
            if (!$product) {
                Log::warning("ไม่พบข้อมูลสินค้าสำหรับ order detail ID: {$orderItem->id}");
                continue;
            }

            Log::info("กำลังค้นหาวัตถุดิบสำหรับสินค้า: {$product->name} (จำนวน: {$orderItem->quantity})");

            // วนลูปแต่ละวัตถุดิบที่ใช้ในสินค้า
            $productIngredients = \App\Models\ProductIngredients::with('ingredient')
                ->where('product_id', $product->id)
                ->get();

            foreach ($productIngredients as $productIngredient) {
                if (!$productIngredient->ingredient) {
                    Log::warning("ไม่พบข้อมูลวัตถุดิบ ID: {$productIngredient->ingredient_id} สำหรับสินค้า: {$product->name}");
                    continue;
                }

                // คำนวณจำนวนที่ต้องคืนตามขนาดแก้ว
                $amountToRestore = 0;
                switch (strtoupper($orderItem->size)) {
                    case 'S':
                        $amountToRestore = $productIngredient->quantity_size_s * $orderItem->quantity;
                        break;
                    case 'M':
                        $amountToRestore = $productIngredient->quantity_size_m * $orderItem->quantity;
                        break;
                    case 'L':
                        $amountToRestore = $productIngredient->quantity_size_l * $orderItem->quantity;
                        break;
                }

                $ingredient = $productIngredient->ingredient;

                Log::info("คืนวัตถุดิบ: {$ingredient->name} จำนวน {$amountToRestore} {$ingredient->unit->name} (ขนาด: {$orderItem->size})");

                if ($amountToRestore > 0) {
                    // เพิ่มจำนวนวัตถุดิบกลับเข้าคลัง
                    $ingredient->increment('quantity', $amountToRestore);

                    // เก็บข้อมูลการคืนวัตถุดิบ
                    $restoredIngredients[] = [
                        'order_id' => $order->id,
                        'order_detail_id' => $orderItem->id,
                        'ingredient_id' => $ingredient->id,
                        'name' => $ingredient->name,
                        'amount' => $amountToRestore,
                        'unit' => $ingredient->unit,
                        'usage_type' => 'ADD',
                        'created_by' => auth()->id(),
                        'note' => "คืนวัตถุดิบ {$ingredient->name} จากคำสั่งซื้อ {$order->id} (ขนาด: {$orderItem->size})"
                    ];
                }
            }

            // วนลูปแต่ละอุปกรณ์ที่ใช้ในสินค้า
            $productConsumables = \App\Models\ProductConsumables::with('consumable')
                ->where('product_id', $product->id)
                ->get();

            foreach ($productConsumables as $productConsumable) {
                if (!$productConsumable->consumable) {
                    Log::warning("ไม่พบข้อมูลอุปกรณ์ ID: {$productConsumable->consumable_id} สำหรับสินค้า: {$product->name}");
                    continue;
                }

                // คำนวณจำนวนที่ต้องคืนสำหรับอุปกรณ์
                $amountToRestore = $productConsumable->quantity_used * $orderItem->quantity;

                $consumable = $productConsumable->consumable;

                Log::info("คืนอุปกรณ์: {$consumable->name} จำนวน {$amountToRestore} {$consumable->unit->name}");

                if ($amountToRestore > 0) {
                    // เพิ่มจำนวนอุปกรณ์กลับเข้าคลัง
                    $consumable->increment('quantity', $amountToRestore);

                    // เก็บข้อมูลการคืนอุปกรณ์
                    $restoredConsumables[] = [
                        'order_id' => $order->id,
                        'order_detail_id' => $orderItem->id,
                        'consumable_id' => $consumable->id,
                        'name' => $consumable->name,
                        'amount' => $amountToRestore,
                        'unit' => $consumable->unit,
                        'usage_type' => 'ADD',
                        'created_by' => auth()->id(),
                        'note' => "คืนอุปกรณ์ {$consumable->name} จากคำสั่งซื้อ {$order->id}"
                    ];
                }
            }
        }

        Log::info("สรุปการคืนวัตถุดิบและอุปกรณ์:", [
            'ingredients' => $restoredIngredients,
            'consumables' => $restoredConsumables
        ]);

        return [
            'restored_ingredients' => $restoredIngredients,
            'restored_consumables' => $restoredConsumables,
        ];
    }

    private function refundPoints(Order $order)
    {
        Log::debug(__METHOD__ . ': Start');

        // Load point usages relationship if not loaded
        if (!$order->relationLoaded('pointUsages')) {
            Log::debug(__METHOD__ . ': Load pointUsages relationship');
            $order->load('pointUsages');
        }

        // คำนวณคะแนนที่ต้องคืน
        $pointsToRefund = 0;

        Log::debug(__METHOD__ . ': Calculate points to refund');

        // ตรวจสอบว่ามี pointUsages หรือไม่
        if ($order->pointUsages) {
            Log::debug(__METHOD__ . ': Point usages found');

            foreach ($order->pointUsages as $usage) {
                if ($usage->type === 'plus') {
                    Log::debug(__METHOD__ . ': Found plus point usage');
                    $pointsToRefund += $usage->point_amount;
                }
            }
        }

        if ($pointsToRefund <= 0) {
            Log::debug(__METHOD__ . ': Points to refund is 0, return');
            return;
        }

        $customer = $order->customer;

        Log::debug(__METHOD__ . ': Decrement customer points');

        // หักคะแนนที่ได้รับจากการซื้อ
        $customer->decrement('loyalty_points', $pointsToRefund);

        Log::debug(__METHOD__ . ': Create point usage');

        // สร้างประวัติการคืนคะแนน
        PointUsage::create([
            'order_id' => $order->id,
            'customer_id' => $customer->id,
            'user_id' => Auth::user()->id,
            'point_amount' => $pointsToRefund,
            'point_discount_amount' => 0,
            'type' => 'minus'
        ]);

        Log::debug(__METHOD__ . ': End');
    }

    private function createExpenseRecord(Order $order, float $refundAmount)
    {
        Log::debug('สร้างบันทึกค่าใช้จ่ายสำหรับการคืนเงินส่วนต่างจากการยกเลิกคำสั่งซื้อ #' . $order->order_number);
        try {
            Expense::create([
                'amount' => $refundAmount,
                'expense_category_id' => 3, // ต้องกำหนด category_id สำหรับการคืนเงิน
                'name' => 'คืนเงินส่วนต่างจากการยกเลิกคำสั่งซื้อ #' . $order->order_number,
                'description' => 'คืนเงินส่วนต่างจากการยกเลิกคำสั่งซื้อ #' . $order->order_number,
                'date' => now(),
                'user_id' => Auth::user()->id
            ]);
        } catch (\Throwable $e) {
            Log::error('Error recording expense: ' . $e->getMessage());
            throw $e;
        }
    }
}
