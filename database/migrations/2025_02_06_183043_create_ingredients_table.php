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
        Schema::create('ingredients', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('ชื่อวัตถุดิบ');
            $table->decimal('quantity', 10, 2)->default(0)->comment('จำนวนคงเหลือ');
            $table->date('expiration_date')->nullable()->comment('วันหมดอายุ');
            $table->string('image')->nullable()->comment('รูปภาพวัตถุดิบ');
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null')->comment('หน่วยของวัตถุดิบ');
            $table->boolean('is_sweetness')->default(false)->comment('เป็นสารให้ความหวาน');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredients');
    }
};
