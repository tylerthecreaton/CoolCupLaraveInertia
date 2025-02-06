<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Consumable;
use App\Models\Unit;

class ConsumableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ดึง unit ที่เป็นประเภท consumable
        $units = Unit::where('type', 'consumable')->get();

        $consumables = [
            [
                'name' => 'แก้วขนาด S',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'แก้วขนาด M',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'แก้วขนาด L',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'หลอดแก้ว',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'ฝาปิดแก้วขนาด S',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'ฝาปิดแก้วขนาด M',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'ฝาปิดแก้วขนาด L',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],
            [
                'name' => 'ถุงกระดาษใส่แก้ว',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'ชิ้น')->first()->id,
                'is_depend_on_sale' => true,
            ],

        ];

        foreach ($consumables as $consumable) {
            Consumable::create($consumable);
        }
    }
}
