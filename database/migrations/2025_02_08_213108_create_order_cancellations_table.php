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
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->text('cancellation_reason')->notNull();
            $table->boolean('is_restock_possible')->default(0)->notNull();
            $table->decimal('refunded_amount', 10, 2)->notNull();
            $table->boolean('refunded_discount')->default(0)->notNull();
            $table->decimal('refunded_points', 10, 2)->default(0.00)->notNull();
            $table->decimal('expense_amount', 10, 2)->default(0.00)->notNull()->comment('จำนวนเงินที่บันทึกเป็นค่าใช้จ่าย กรณีคืนเงินมากกว่ายอดขาย');
            $table->longText('restored_ingredients')->nullable()->default(null)->comment('วัตถุดิบที่คืนเข้าสต็อก');
            $table->longText('restored_consumables')->nullable();
            $table->timestamps();
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
