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
            $table->integer('order_detail_id')->nullable();
            $table->integer('ingredient_id')->notNullable();
            $table->decimal('amount', 10, 2)->notNullable()->comment('จำนวนที่ใช้');
            $table->enum('usage_type', ['ADD', 'USE'])->notNullable()->comment('ประเภทการใช้งาน');
            $table->string('reference_no', 50)->nullable()->comment('เลขที่อ้างอิง');
            $table->text('note')->nullable()->comment('หมายเหตุ');
            $table->integer('created_by')->nullable()->comment('ผู้บันทึกรายการ');
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
