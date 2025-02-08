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
        Schema::create('product_consumable_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId(column: 'consumable_id')->constrained(table: 'consumables')->onDelete('cascade');
            $table->foreignId(column: 'order_detail_id')->constrained(table: 'order_details')->onDelete('cascade');
            $table->decimal('quantity_used', 10, 2)->default(0.00);
            $table->enum('usage_type', allowed: ['ADD', 'USE'])->default('ADD');
            $table->string('reference_no')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_consumable_usages');
    }
};
