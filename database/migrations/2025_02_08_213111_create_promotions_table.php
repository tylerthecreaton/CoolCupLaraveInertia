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
        Schema::create('promotions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('image')->nullable();
            $table->enum('type', ['PERCENTAGE','FIXED','BUY_X_GET_Y','CATEGORY_DISCOUNT'])->default('FIXED');
            $table->decimal('percentage', 10, 2)->default(0.00);
            $table->decimal('fixed', 10, 2)->default(0.00);
            $table->json('buy_x_get_y')->default(0);
            $table->json('category')->default(0);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promotions');
    }
};
