<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('cancellation_reason')->comment('เหตุผลการยกเลิก');
            $table->boolean('is_restock_possible')->default(false)->comment('สามารถนำสินค้ากลับเข้าสต็อกได้หรือไม่');
            $table->decimal('refunded_amount', 10, 2)->comment('จำนวนเงินที่คืน');
            $table->boolean('refunded_discount')->default(false)->comment('คืนส่วนลดหรือไม่');
            $table->decimal('refunded_points', 10, 2)->default(0)->comment('คะแนนที่คืนให้ลูกค้า');
            $table->decimal('expense_amount', 10, 2)->default(0)->comment('จำนวนเงินที่บันทึกเป็นค่าใช้จ่าย กรณีคืนเงินมากกว่ายอดขาย');
            $table->json('restored_ingredients')->nullable()->comment('วัตถุดิบที่คืนเข้าสต็อก');
            $table->json('restored_consumables')->nullable()->comment('อุปกรณ์ที่คืนเข้าสต็อก');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_cancellations');
    }
};
