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
        Schema::create('ingredient_lot_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ingredient_lot_id')->constrained('ingredients_lots')->cascadeOnDelete();
            $table->foreignId('transformer_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('ingredient_id')->constrained()->cascadeOnDelete();
            $table->integer('lot_number')->default(0);
            $table->enum('type', ['in', 'out'])->default('in');
            $table->integer('quantity');
            $table->date('expiration_date')->default(now());
            $table->decimal('price', 10, 2)->default(0.00);
            $table->integer('per_pack')->default(0);
            $table->decimal('cost_per_unit', 10, 2)->default(0.00);
            $table->string('supplier')->nullable();
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_lot_details');
    }
};
