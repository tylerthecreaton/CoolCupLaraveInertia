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
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->unsignedBigInteger('customer_id');
            $table->foreign('customer_id')->references('id')->on('customers')->onDelete('cascade');
            $table->dateTime('receipt_date');
            $table->decimal('total_amount',10,2)->default(0);
            $table->decimal('discount_amount',10,2)->default(0);
            $table->decimal('tax_amount',10,2)->default(0);
            $table->decimal('final_amount',10,2)->default(0);
            $table->enum('payment_method', ['cash', 'qr_code']);
            $table->unsignedBigInteger('point_earned')->default(0);
            $table->unsignedBigInteger('point_balance')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reciepts');
    }
};
