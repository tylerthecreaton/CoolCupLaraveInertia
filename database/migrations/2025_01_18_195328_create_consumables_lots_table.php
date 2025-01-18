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
        Schema::create('consumables_lots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('consumable_id');
            $table->foreign('consumable_id')->references('id')->on('consumables')->onDelete('cascade');
            $table->integer('quantity');
            $table->enum('type', ['in', 'out'])->default('in');
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('per_pack')->default(0);
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consumables_lots');
    }
};
