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
        Schema::create('withdraw_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('withdraw_id')->constrained()->onDelete('cascade');
            $table->string('type'); // ingredient or consumable
            $table->foreignId('ingredient_lot_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('consumable_lot_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('transformer_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('quantity', 10, 2);
            $table->string('unit')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('withdraw_items');
    }
};
