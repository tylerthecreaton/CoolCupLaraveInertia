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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger(column: 'customer_id');
            $table->foreign('customer_id')->references('id')->on('customers');
            $table->unsignedBigInteger('promotions_id')->nullable();
            $table->foreign('promotions_id')->references('id')->on('promotions');
            $table->unsignedBigInteger('total_amount')->comment('ราคาที่ยังไม่รวมส่วนลด');
            $table->unsignedBigInteger('discount_amount')->default(0)->comment('ส่วนลด');
            $table->unsignedBigInteger('final_amount')->comment('ราคาที่ต้องชําระ');
            $table->dateTime('order_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
