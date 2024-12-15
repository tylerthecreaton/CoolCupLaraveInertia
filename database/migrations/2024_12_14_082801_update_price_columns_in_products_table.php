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
        Schema::table('products', function (Blueprint $table) {
            // ลบคอลัมน์ราคา
            $table->dropColumn('price');

            // เพิ่มคอลัมน์ราคาต้นทุนและราคาขาย
            $table->decimal('cost_price', 10, 2)->after('name')->nullable();
            $table->decimal('sale_price', 10, 2)->after('cost_price')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            // ลบคอลัมน์ราคาต้นทุนและราคาขาย
            $table->dropColumn('cost_price');
            $table->dropColumn('sale_price');
        });
    }
};
