<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUnitIdToIngredientsTable extends Migration
{

    public function up()
    {
        Schema::table('ingredients', function (Blueprint $table) {
            $table->foreignId('unit_id')->nullable()->constrained('units')->onDelete('set null');
        });
    }
    public function down()
    {
        Schema::table('ingredients', function (Blueprint $table) {
            $table->dropForeign(['unit_id']);
            $table->dropColumn('unit_id');
        });
    }
}
