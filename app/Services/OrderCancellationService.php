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

        foreach ($order->orderDetails as $detail) {
            // หาวัตถุดิบที่ใช้ในสินค้า
            $ingredients = ProductIngredients::where('product_id', $detail->product_id)
                ->with('ingredient')
                ->get();

            foreach ($ingredients as $ingredient) {
                $quantity = $ingredient->quantity_used * $detail->quantity;

                // เพิ่มจำนวนวัตถุดิบกลับเข้าสต็อก
                $ingredient->ingredient->increment('quantity', $quantity);

                $restoredIngredients[] = [
                    'order_id' => $order->id,
                    'order_detail_id' => $detail->id,
                    'ingredient_id' => $ingredient->ingredient_id,
                    'name' => $ingredient->ingredient->name,
                    'amount' => $quantity,
                    'usage_type' => 'ADD',
                    'created_by' => Auth::user()->id,
                    'note' => "คืนวัตถุดิบ {$ingredient->ingredient->name} จากคำสั่งซื้อ {$order->id}"
                ];
            }

            Log::info("Restoring consumables for order {$order->id}");

            // TODO: เพิ่มการจัดการ consumables ตามความต้องการ
        }

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
