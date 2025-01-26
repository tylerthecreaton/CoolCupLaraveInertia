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
        Schema::table('withdraws', function (Blueprint $table) {
            // Drop foreign keys first
            $table->dropForeign(['consumable_lot_id']);
            $table->dropForeign(['ingredient_lot_id']);

            // Drop columns
            $table->dropColumn('consumable_lot_id');
            $table->dropColumn('ingredient_lot_id');
            $table->dropColumn('quantity');
            $table->dropColumn('unit');

            // Add new status column
            $table->string('status')->default('pending')->after('user_id'); // pending, completed, cancelled
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('withdraws', function (Blueprint $table) {
            $table->dropColumn('status');

            $table->unsignedBigInteger('consumable_lot_id')->nullable();
            $table->foreign('consumable_lot_id')->references('id')->on('consumable_lots')->onDelete('set null');
            $table->unsignedBigInteger('ingredient_lot_id')->nullable();
            $table->foreign('ingredient_lot_id')->references('id')->on('ingredient_lots')->onDelete('set null');
            $table->decimal('quantity', 10, 2);
            $table->string('unit');
        });
    }
};
