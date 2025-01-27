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
            $table->unsignedBigInteger('order_id');
            $table->string('cancellation_reason')->nullable();
            $table->boolean('is_restock_possible');
            $table->text('restocked_items')->nullable();
            $table->decimal('refunded_amount', 10, 2);
            $table->boolean('refunded_discount');
            $table->integer('refunded_points');
            $table->unsignedBigInteger('processed_by');
            $table->foreign('order_id')->references('id')->on('orders');
            $table->foreign('processed_by')->references('id')->on('users');
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
