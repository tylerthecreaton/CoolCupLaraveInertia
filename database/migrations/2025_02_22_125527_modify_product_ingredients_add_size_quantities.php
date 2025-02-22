<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('product_ingredients', function (Blueprint $table) {
            $table->decimal('quantity_size_s', 10, 2)->after('quantity_used')->default(0);
            $table->decimal('quantity_size_m', 10, 2)->after('quantity_size_s')->default(0);
            $table->decimal('quantity_size_l', 10, 2)->after('quantity_size_m')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('product_ingredients', function (Blueprint $table) {
            $table->dropColumn(['quantity_size_s', 'quantity_size_m', 'quantity_size_l']);
        });
    }
};
