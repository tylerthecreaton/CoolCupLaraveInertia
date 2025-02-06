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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('ชื่อโปรโมชั่น');
            $table->decimal('discount', 10, 2)->comment('ส่วนลด');
            $table->enum('type', ['PERCENTAGE', 'FIXED', 'BUY_X_GET_Y', 'CATEGORY_DISCOUNT'])->default('PERCENTAGE')->comment('ประเภทโปรโมชั่น');
            $table->date('start_date')->comment('วันเริ่มต้นโปรโมชั่น');
            $table->date('end_date')->comment('วันสิ้นสุดโปรโมชั่น');
            $table->string('image')->nullable()->comment('รูปภาพโปรโมชั่น');
            $table->text('description')->nullable()->comment('คำอธิบายโปรโมชั่น');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
