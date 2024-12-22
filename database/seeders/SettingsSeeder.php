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
        Setting::create([
            'key' => 'vat_rate',
            'value' => '7',
            'description' => 'อัตราภาษีมูลค่าเพิ่ม (VAT) ในประเทศไทย',
            'type' => 'system',
            'comment' => 'ใช้สำหรับคำนวณภาษีมูลค่าเพิ่มในระบบ'
        ]);
    }
}
