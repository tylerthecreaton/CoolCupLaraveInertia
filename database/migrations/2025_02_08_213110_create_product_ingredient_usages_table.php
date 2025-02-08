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
        Schema::create('product_ingredient_usages', function (Blueprint $table) {
            $table->id();
            $table->integer('order_detail_id')->nullable()->default(null);
            $table->integer('ingredient_id')->nullable(false);
            $table->decimal('amount', 10, 2);
            $table->enum('usage_type', ['ADD', 'USE'])->default('ADD');
            $table->string('reference_no', 50)->nullable()->default(null);
            $table->text('note')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_ingredient_usages');
    }
};
