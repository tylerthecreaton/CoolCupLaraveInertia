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
        Schema::create('withdraws', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign(columns: 'user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('consumable_lot_id')->nullable();
            $table->foreign('consumable_lot_id')->references('id')->on('consumable_lots')->onDelete('set null');
            $table->unsignedBigInteger('ingredient_lot_id')->nullable();
            $table->foreign('ingredient_lot_id')->references('id')->on('ingredient_lots')->onDelete('set null');
            $table->decimal('quantity', 10, 2);
            $table->string('unit');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdraws');
    }
};
