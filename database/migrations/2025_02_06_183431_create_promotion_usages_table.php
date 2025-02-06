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
        Schema::create('promotion_usages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promotion_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->decimal('discount_amount', 10, 2)->comment('จำนวนส่วนลดที่ได้รับ');
            $table->string('promotion_type')->comment('ประเภทโปรโมชั่นที่ใช้');
            $table->decimal('promotion_value', 10, 2)->nullable()->comment('มูลค่าโปรโมชั่น');
            $table->json('promotion_details')->nullable()->comment('รายละเอียดโปรโมชั่น');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotion_usages');
    }
};
