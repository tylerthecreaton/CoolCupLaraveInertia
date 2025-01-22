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

        // Create ingredient_lot_details table
        Schema::create('ingredient_lot_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ingredient_lot_id');
            $table->unsignedInteger('lot_number');
            $table->unsignedBigInteger('ingredient_id');
            $table->enum('type', ['in', 'out'])->default('in');
            $table->integer('quantity');
            $table->date('expiration_date');
            $table->decimal('price', 10, 2)->default(0);
            $table->decimal('cost_per_unit', 10, 2)->default(0);
            $table->integer('per_pack')->default(1);
            $table->string('supplier')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('ingredient_lot_id')->references('id')->on('ingredient_lots')->onDelete('cascade');
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ingredient_lot_details');

        // Restore ingredient_lots table to original state
        Schema::table('ingredient_lots', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('lot_number');

            $table->unsignedBigInteger('ingredient_id')->after('id');
            $table->decimal('quantity')->after('ingredient_id');
            $table->date('expiration_date')->after('quantity');
            $table->string('notes')->nullable()->change();

            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
