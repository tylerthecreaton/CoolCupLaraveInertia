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
        Schema::create('order_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('product_id')->unsigned()->notNull();
            $table->string('line_item_id')->default('');
            $table->string('product_name')->default('');
            $table->string('product_image')->default('');
            $table->bigInteger('quantity')->unsigned()->notNull();
            $table->decimal('price', 10, 2)->default(0.00)->notNull();
            $table->string('size')->default('');
            $table->string('sweetness')->default('');
            $table->longText('toppings')->nullable()->default(null)->check('json_valid(toppings)');
            $table->decimal('subtotal', 10, 2)->default(0.00)->notNull();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_details');
    }
};
