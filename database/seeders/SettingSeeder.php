<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            [
                'key' => 'ingredient_expired_before_date',
                'value' => '7',
                'description' => 'จำนวนวันที่จะแจ้งเตือนก่อนวัตถุดิบหมดอายุ',
                'type' => 'system',
                'comment' => 'ใช้สำหรับการแจ้งเตือนวัตถุดิบที่ใกล้หมดอายุ'
            ],
            [
                'key' => 'minimum_ingredient_stock_alert',
                'value' => '1000',
                'description' => 'จำนวนขั้นต่ำของวัตถุดิบที่จะแจ้งเตือน',
                'type' => 'system',
                'comment' => 'ใช้สำหรับการแจ้งเตือนวัตถุดิบที่ใกล้หมด'
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
