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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('ชื่อลูกค้า');
            $table->string('phone_number')->comment('เบอร์โทรศัพท์');
            $table->date('birthdate')->comment('วันเกิด');
            $table->decimal('loyalty_points', 10, 2)->default(0)->comment('คะแนนสะสม');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
