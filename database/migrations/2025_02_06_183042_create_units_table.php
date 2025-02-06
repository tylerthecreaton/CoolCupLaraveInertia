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
        Schema::create('units', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique()->comment('ชื่อหน่วย เช่น กรัม, มิลลิลิตร');
            $table->string('abbreviation')->nullable()->comment('ตัวย่อ เช่น g, ml');
            $table->enum('type', ['ingredient', 'consumable'])->comment('ประเภทการใช้งาน: วัตถุดิบหรือวัสดุสิ้นเปลือง');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
