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
        Schema::table('product_ingredient_usages', function (Blueprint $table) {
            $table->enum('usage_type', ['ADD', 'USE', 'DISPOSE'])->default('ADD')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_ingredient_usages', function (Blueprint $table) {
            $table->enum('usage_type', ['ADD', 'USE'])->default('ADD')->change();
        });
    }
};
