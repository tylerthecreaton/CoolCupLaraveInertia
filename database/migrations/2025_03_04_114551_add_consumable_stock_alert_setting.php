<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Setting;

return new class extends Migration
{
    public function up()
    {
        Setting::create([
            'key' => 'minimum_consumable_stock_alert',
            'value' => '100',
            'description' => 'จำนวนขั้นต่ำของวัตถุดิบสิ้นเปลืองที่จะแจ้งเตือน',
            'type' => 'system',
            'comment' => 'Default minimum stock level for consumables alerts'
        ]);
    }

    public function down()
    {
        Setting::where('key', 'minimum_consumable_stock_alert')->delete();
    }
};
