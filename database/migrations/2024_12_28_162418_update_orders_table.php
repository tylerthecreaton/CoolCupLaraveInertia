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
        Schema::table('orders', function (Blueprint $table) {
            $table->string('username')->nullable();
            $table->enum('discount_type', ['manual', 'promotion'])->nullable();
            $table->decimal('manual_discount_amount', 10, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('username');
            $table->dropColumn('discount_type');
            $table->dropColumn('manual_discount_amount');
        });
    }
};
