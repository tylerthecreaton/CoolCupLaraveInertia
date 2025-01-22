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
        Schema::create('unit_conversions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('from_unit_id')->constrained('units')->onDelete('cascade');
            $table->foreignId('to_unit_id')->constrained('units')->onDelete('cascade');
            $table->decimal('conversion_factor', 15, 5); // ใช้ decimal(15,5) เพื่อรองรับตัวเลขทศนิยมที่มีความแม่นยำสูง
            $table->string('notes')->nullable();
            $table->timestamps();

            // เพิ่ม unique constraint เพื่อป้องกันการสร้าง conversion ซ้ำ
            $table->unique(['from_unit_id', 'to_unit_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('unit_conversions');
    }
};
