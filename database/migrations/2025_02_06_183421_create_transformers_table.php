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
        Schema::create('transformers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ingredient_id')->nullable();
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
            $table->unsignedBigInteger('consumable_id')->nullable();
            $table->foreign('consumable_id')->references('id')->on('consumables')->onDelete('cascade');
            $table->string('name')->comment('ชื่อการแปลง');
            $table->string('description')->comment('คำอธิบายการแปลง');
            $table->decimal('multiplier', 10, 2)->comment('ตัวคูณในการแปลง');
            $table->enum('type', ['ingredient', 'consumable'])->comment('ประเภทการแปลง');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transformers');
    }
};
