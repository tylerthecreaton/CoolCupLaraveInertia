<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateConsumablesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('consumables', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // ชื่อวัสดุสิ้นเปลือง เช่น แก้วน้ำ, หลอด
            $table->string('category')->nullable(); // ประเภท เช่น แก้ว, หลอด
            $table->integer('quantity')->default(0); // จำนวนคงเหลือ
            $table->string('unit')->nullable(); // หน่วย เช่น ชิ้น, กล่อง
            $table->decimal('cost_per_unit', 8, 2)->nullable(); // ราคาต่อหน่วยใช้คิดต้นทุน
            $table->integer('minimum_stock')->default(0); // จำนวนขั้นต่ำที่ต้องเก็บไว้ในสต็อก
            $table->timestamps(); // created_at และ updated_at
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('consumables');
    }
}
