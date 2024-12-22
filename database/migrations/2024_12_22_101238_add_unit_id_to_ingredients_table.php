<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUnitIdToIngredientsTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('ingredients', function (Blueprint $table) {
            // Add the unit_id column as a foreign key
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('ingredients', function (Blueprint $table) {
            // Drop the foreign key and the unit_id column
            $table->dropForeign(['unit_id']);
            $table->dropColumn('unit_id');
        });
    }
}
