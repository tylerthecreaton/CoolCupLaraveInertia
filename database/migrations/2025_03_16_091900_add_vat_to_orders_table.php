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
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('vat_rate', 5, 2)->nullable()->after('final_amount')->comment('อัตราภาษีมูลค่าเพิ่ม (%)');
            $table->decimal('vat_amount', 10, 2)->nullable()->after('vat_rate')->comment('จำนวนภาษีมูลค่าเพิ่ม');
            $table->decimal('subtotal_before_vat', 10, 2)->nullable()->after('vat_amount')->comment('ยอดรวมก่อนภาษีมูลค่าเพิ่ม');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['vat_rate', 'vat_amount', 'subtotal_before_vat']);
        });
    }
};
