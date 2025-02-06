<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $units = [
            // หน่วยสำหรับวัตถุดิบ (Ingredient)
            [
                'name' => 'กรัม',
                'abbreviation' => 'ก.',
                'type' => 'ingredient'
            ],
            [
                'name' => 'กิโลกรัม',
                'abbreviation' => 'กก.',
                'type' => 'ingredient'
            ],
            [
                'name' => 'มิลลิลิตร',
                'abbreviation' => 'มล.',
                'type' => 'ingredient'
            ],
            [
                'name' => 'ลิตร',
                'abbreviation' => 'ล.',
                'type' => 'ingredient'
            ],
            [
                'name' => 'ถ้วย',
                'abbreviation' => 'ถ.',
                'type' => 'ingredient'
            ],
            [
                'name' => 'ช้อนโต๊ะ',
                'abbreviation' => 'ชต.',
                'type' => 'ingredient'
            ],
            [
                'name' => 'ช้อนชา',
                'abbreviation' => 'ชช.',
                'type' => 'ingredient'
            ],

            // หน่วยสำหรับวัตถุดิบสิ้นเปลือง (Consumable)
            [
                'name' => 'ชิ้น',
                'abbreviation' => 'ชิ้น',
                'type' => 'consumable'
            ],
            [
                'name' => 'แพ็ค',
                'abbreviation' => 'แพ็ค',
                'type' => 'consumable'
            ],
            [
                'name' => 'กล่อง',
                'abbreviation' => 'กล.',
                'type' => 'consumable'
            ],
            [
                'name' => 'ม้วน',
                'abbreviation' => 'ม.',
                'type' => 'consumable'
            ],
            [
                'name' => 'ใบ',
                'abbreviation' => 'ใบ',
                'type' => 'consumable'
            ],
            [
                'name' => 'อัน',
                'abbreviation' => 'อัน',
                'type' => 'consumable'
            ],
        ];

        foreach ($units as $unit) {
            Unit::create($unit);
        }
    }
}
