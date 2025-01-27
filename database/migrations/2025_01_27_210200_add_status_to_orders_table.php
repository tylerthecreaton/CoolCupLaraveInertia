<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('orders', function (Blueprint $table) {
            // เพิ่ม status column ถ้ายังไม่มี
            if (!Schema::hasColumn('orders', 'status')) {
                $table->string('status')->default('completed')->after('user_id');
            }
        });

        // อัพเดทข้อมูลเก่าให้มี status เป็น completed
        DB::table('orders')->whereNull('status')->update(['status' => 'completed']);
    }

    public function down()
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
