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
        Schema::table('consumable_lots', function (Blueprint $table) {
            $table->unsignedInteger('lot_number')->default(0);
            $table->text('note')->nullable()->change();
            $table->dropColumn('type');
            $table->dropColumn('per_pack');
            $table->dropColumn('cost_per_unit');
            $table->dropColumn('supplier');
            $table->dropColumn('quantity');
            $table->dropColumn('price');
        });

        Schema::create('consumable_lot_details', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consumable_lot_id');
            $table->foreign('consumable_lot_id')->references('id')->on('consumable_lots')->onDelete('cascade');
            $table->unsignedBigInteger('consumable_id');
            $table->foreign('consumable_id')->references('id')->on('consumables')->onDelete('cascade');
            $table->enum('type', ['in', 'out'])->default('in');
            $table->integer('quantity');
            $table->unsignedInteger('lot_number')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('per_pack')->default(0);
            $table->decimal('cost_per_unit', 10, 2)->default(0);
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
        Schema::dropIfExists('consumable_lot_details');
    }
};
