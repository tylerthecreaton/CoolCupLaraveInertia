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
        Schema::create('consumables', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('ชื่อวัตถุดิบ');
            $table->decimal('quantity', 10, 2)->comment('จำนวน');
            $table->foreignId('unit_id')->constrained('units')->comment('หน่วย');
            $table->boolean('is_depend_on_sale')->default(false)->comment('ใช้ในการขาย');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumables');
    }
};
