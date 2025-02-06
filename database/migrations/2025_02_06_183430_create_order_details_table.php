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
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->unsignedBigInteger('product_id');
            $table->string('line_item_id')->default('')->comment('รหัสรายการสินค้า');
            $table->string('product_name')->default('')->comment('ชื่อสินค้า ณ เวลาที่สั่ง');
            $table->string('product_image')->default('')->comment('รูปสินค้า ณ เวลาที่สั่ง');
            $table->unsignedBigInteger('quantity')->comment('จำนวนที่สั่ง');
            $table->decimal('price', 10, 2)->default(0)->comment('ราคาต่อชิ้น');
            $table->string('size')->default('')->comment('ขนาดสินค้า');
            $table->string('sweetness')->default('')->comment('ระดับความหวาน');
            $table->json('toppings')->nullable()->comment('ท็อปปิ้งที่เลือก');
            $table->decimal('subtotal', 10, 2)->default(0)->comment('ราคารวมของรายการนี้');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
