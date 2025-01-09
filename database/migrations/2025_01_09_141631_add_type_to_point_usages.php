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
        Schema::table('point_usages', function (Blueprint $table) {
            $table->string('type')->default('minus')->after('point_discount_amount');
            $table->decimal('used_points', 10, 2)->default(0)->change();
            $table->renameColumn('used_points', 'point_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('point_usages', function (Blueprint $table) {
            $table->dropColumn('type');
        });
    }
};
