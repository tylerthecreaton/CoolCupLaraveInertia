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
        Schema::table('consumables', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->dropColumn('minimum_stock');
            $table->dropColumn('cost_per_unit');
            $table->boolean('is_depend_on_sale')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('consumables', function (Blueprint $table) {
            $table->string('category')->nullable();
            $table->integer('minimum_stock')->default(0);
            $table->decimal('cost_per_unit', 10, 2)->nullable();
            $table->dropColumn('is_depend_on_sale');
        });
    }
};
