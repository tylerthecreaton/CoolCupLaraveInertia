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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->bigInteger('customer_id')->unsigned()->nullable()->default(null);
            $table->bigInteger('promotion_id')->unsigned()->nullable()->default(null);
            $table->bigInteger('total_amount')->unsigned()->notNull()->comment('ราคาที่ยังไม่รวมส่วนลด');
            $table->bigInteger('discount_amount')->unsigned()->notNull()->default(0)->comment('ส่วนลด');
            $table->bigInteger('final_amount')->unsigned()->notNull()->comment('ราคาที่ต้องชําระ');
            $table->enum('payment_method', ['cash', 'qr_code'])->default('cash');
            $table->string('receipt_path', 255)->nullable()->default(null);
            $table->decimal('cash', 10, 2)->notNull()->default(0.00);
            $table->string('file_name', 255)->nullable()->default(null);
            $table->string('note', 255)->nullable()->default(null);
            $table->bigInteger('total_items')->unsigned()->nullable()->default(null);
            $table->mediumInteger('order_number')->unsigned()->notNull();
            $table->float('received_points')->notNull()->default(0);
            $table->string('status', 255)->default('completed');
            $table->string('payment_note', 255)->nullable()->default(null);
            $table->string('username', 255)->nullable()->default(null);
            $table->enum('discount_type', ['manual', 'promotion'])->nullable()->default(null);
            $table->decimal('manual_discount_amount', 10, 2)->nullable()->default(null);
            $table->string('customer_name', 255)->nullable()->default(null);
            $table->decimal('point_discount_amount', 10, 2)->nullable()->default(null);
            $table->integer('used_points')->nullable()->default(null);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
