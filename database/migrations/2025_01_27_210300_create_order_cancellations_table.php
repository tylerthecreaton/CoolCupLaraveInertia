<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('order_cancellations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('cancellation_reason');
            $table->boolean('is_restock_possible')->default(false);
            $table->decimal('refunded_amount', 10, 2);
            $table->boolean('refunded_discount')->default(false);
            $table->decimal('refunded_points', 10, 2)->default(0);
            $table->decimal('expense_amount', 10, 2)->default(0)->comment('จำนวนเงินที่บันทึกเป็นค่าใช้จ่าย กรณีคืนเงินมากกว่ายอดขาย');
            $table->json('restored_ingredients')->nullable()->comment('วัตถุดิบที่คืนเข้าสต็อก');
            $table->json('restored_consumables')->nullable()->comment('อุปกรณ์ที่คืนเข้าสต็อก');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('order_cancellations');
    }
};
