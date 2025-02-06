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
        Schema::create('point_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->decimal('point_amount', 10, 2)->default(0)->comment('จำนวนคะแนนที่ใช้หรือได้รับ');
            $table->decimal('point_discount_amount', 10, 2)->comment('มูลค่าส่วนลดจากคะแนน');
            $table->string('type')->default('minus')->comment('ประเภทรายการ (plus/minus)');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_usages');
    }
};
