<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'key' => 'vat_rate',
                'value' => '7',
                'description' => 'อัตราภาษีมูลค่าเพิ่ม (VAT) ในประเทศไทย',
                'type' => 'system',
                'comment' => 'ใช้สำหรับคำนวณภาษีมูลค่าเพิ่มในระบบ'
            ],
            [
                'key' => 'point_rate',
                'value' => '0.01',
                'description' => 'อัตราคะแนนสำหรับแต้มสั่งซื้อ',
                'type' => 'system',
                'comment' => 'ใช้สำหรับคำนวณแต้มสั่งซื้อ'
            ]
        ];
        Setting::insert($settings);
    }
}
