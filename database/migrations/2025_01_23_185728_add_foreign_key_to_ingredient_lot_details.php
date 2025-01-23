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
        Schema::table('ingredient_lot_details', function (Blueprint $table) {
            $table->foreignId('transformer_id')->nullable()->constrained('transformers')->onDelete('set null');

        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ingredient_lot_details', function (Blueprint $table) {
            $table->dropForeign(['transformer_id']);
            $table->dropColumn('transformer_id');
        });
    }
};
