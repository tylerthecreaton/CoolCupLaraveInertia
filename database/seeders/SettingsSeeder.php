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
            ],
            [
                'key'=> 'minimum_ingredient_stock_alert',
                'value'=> '1000',
                'description' => '	เตือนเมื่อวัตถุดิบน้อยกว่า',
                'type' => 'system',
                'comment' => 'ใช้สำหรับคำนวณเตือนเมื่อวัตถุดิบน้อยกว่า'
            ],
            [
                'key'=> 'ingredient_expired_before_date',
                'value'=> '5',
                'description' => '	เตือนเมื่อวันหมดอายุเหลือน้อยกว่า 5 วัน',
                'type' => 'system',
                'comment' => 'ใช้สำหรับคำนวณเตือนเมื่อวัตถุดิบหมดอายุ'
            ],
            [
                'key'=> 'point_per_thb',
                'value'=> '10',
                'description' => '10 คะแนนเท่ากับ 1 บาท',
                'type' => 'system',
                'comment' => 'Rate แลกคะแนนเป็นเงิน'
            ],
            [
                'key'=> 'promptpay_number',
                'value'=> 'xxx-xxx-xxx',
                'description' => 'เบอร์พร้อมเพย์สำหรับจ่ายเงิน',
                'type' => 'system',
                'comment' => 'เบอร์พร้อมเพย์สำหรับจ่ายเงิน'
            ],
            [
                'key'=> 'taxpayer_number',
                'value'=> 'xxx-xxx-xxx',
                'description' => 'เลขประจำตัวผู้เสียภาษี',
                'type' => 'system',
                'comment' => 'เลขประจำตัวผู้เสียภาษี'
            ],
            [
                'key'=> 'minimum_consumable_stock_alert',
                'value'=> '100',
                'description' => 'จำนวนขั้นต่ำของวัตถุดิบสิ้นเปลืองที่จะแจ้งเตือน',
                'type' => 'system',
                'comment' => 'Default minimum stock level for consumables alerts'
            ]
        ];
        Setting::insert($settings);
    }
}
