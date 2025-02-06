<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id')->nullable()->comment('รหัสลูกค้า (ถ้ามี)');
            $table->string('customer_name')->nullable()->comment('ชื่อลูกค้า กรณีไม่ได้เป็นสมาชิก');
            $table->unsignedBigInteger('promotions_id')->nullable()->comment('รหัสโปรโมชั่นที่ใช้');
            $table->unsignedBigInteger('user_id')->nullable()->comment('รหัสพนักงานที่ทำรายการ');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->string('username')->nullable()->comment('ชื่อผู้ใช้ที่ทำรายการ');
            $table->unsignedMediumInteger('order_number')->comment('เลขที่ออเดอร์');
            $table->unsignedBigInteger('total_amount')->comment('ราคารวมก่อนหักส่วนลด');
            $table->unsignedBigInteger('total_Items')->nullable()->comment('จำนวนสินค้าทั้งหมด');
            $table->enum('discount_type', ['manual', 'promotion'])->nullable()->comment('ประเภทส่วนลด: ป้อนเอง หรือ จากโปรโมชั่น');
            $table->unsignedBigInteger('discount_amount')->default(0)->comment('ส่วนลดรวม');
            $table->decimal('manual_discount_amount', 10, 2)->nullable()->comment('ส่วนลดที่ป้อนเอง');
            $table->decimal('point_discount_amount', 10, 2)->nullable()->comment('ส่วนลดจากการใช้คะแนน');
            $table->integer('used_points')->nullable()->comment('จำนวนคะแนนที่ใช้');
            $table->unsignedBigInteger('final_amount')->comment('ราคาสุทธิ');
            $table->enum('payment_method', ['cash', 'qr_code'])->default('cash')->comment('วิธีการชำระเงิน');
            $table->decimal('cash', 10, 2)->default(0)->comment('จำนวนเงินสดที่รับมา');
            $table->string('receipt_path')->nullable()->comment('path ไฟล์ใบเสร็จ');
            $table->string('file_name')->nullable()->comment('ชื่อไฟล์ QR');
            $table->string('payment_note')->nullable()->comment('หมายเหตุการชำระเงิน');
            $table->string('note')->nullable()->comment('หมายเหตุทั่วไป');
            $table->float('received_points', 10, 2)->default(0)->comment('คะแนนที่ได้รับจากการซื้อ');
            $table->string('status')->default('completed')->comment('สถานะออเดอร์');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
