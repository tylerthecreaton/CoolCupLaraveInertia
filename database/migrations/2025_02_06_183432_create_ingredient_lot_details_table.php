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
        Schema::create('ingredient_lot_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ingredient_lot_id');
            $table->foreign('ingredient_lot_id')->references('id')->on('ingredient_lots')->onDelete('cascade');
            $table->unsignedInteger('lot_number')->comment('เลขที่ล็อต');
            $table->unsignedBigInteger('ingredient_id');
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
            $table->enum('type', ['in', 'out'])->default('in')->comment('ประเภทรายการ (รับเข้า/จ่ายออก)');
            $table->integer('quantity')->comment('จำนวน');
            $table->date('expiration_date')->comment('วันหมดอายุ');
            $table->decimal('price', 10, 2)->default(0)->comment('ราคาซื้อ');
            $table->decimal('cost_per_unit', 10, 2)->default(0)->comment('ต้นทุนต่อหน่วย');
            $table->integer('per_pack')->default(1)->comment('จำนวนต่อแพ็ค');
            $table->string('supplier')->nullable()->comment('ผู้จำหน่าย');
            $table->text('notes')->nullable()->comment('หมายเหตุ');
            $table->foreignId('transformer_id')->nullable()->constrained('transformers')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_lot_details');
    }
};
