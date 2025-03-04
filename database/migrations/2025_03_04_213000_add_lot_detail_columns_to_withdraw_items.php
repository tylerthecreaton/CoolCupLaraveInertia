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
        Schema::table('withdraw_items', function (Blueprint $table) {
            $table->foreignId('ingredient_lot_detail_id')->nullable()->after('ingredient_lot_id');
            $table->foreignId('consumable_lot_detail_id')->nullable()->after('consumable_lot_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('withdraw_items', function (Blueprint $table) {
            $table->dropColumn('ingredient_lot_detail_id');
            $table->dropColumn('consumable_lot_detail_id');
        });
    }
};
