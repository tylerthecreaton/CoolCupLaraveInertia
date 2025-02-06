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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('ชื่อสินค้า');
            $table->string('image')->comment('รูปภาพสินค้า');
            $table->string('description')->comment('คำอธิบายสินค้า');
            $table->decimal('cost_price', 10, 2)->nullable()->comment('ราคาต้นทุน');
            $table->decimal('sale_price', 10, 2)->nullable()->comment('ราคาขาย');
            $table->unsignedBigInteger('category_id');
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
