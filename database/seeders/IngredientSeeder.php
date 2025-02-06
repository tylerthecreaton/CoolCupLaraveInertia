<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ingredient;
use App\Models\Unit;

class IngredientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ดึง unit ที่เป็นประเภท ingredient
        $units = Unit::where('type', 'ingredient')->get();

        $ingredients = [
            [
                'name' => 'เมล็ดกาแฟคั่ว',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'กรัม')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'นมสด',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'มิลลิลิตร')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'น้ำเชื่อมวานิลลา',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'มิลลิลิตร')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'น้ำเชื่อมคาราเมล',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'มิลลิลิตร')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'ช็อกโกแลตซอส',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'มิลลิลิตร')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'วิปครีม',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'มิลลิลิตร')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'น้ำตาลทราย',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'กรัม')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'ผงชาเขียวมัจฉะ',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'กรัม')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'ผงโกโก้',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'กรัม')->first()->id,
                'image' => null,
            ],
            [
                'name' => 'น้ำผึ้ง',
                'quantity' => 0,
                'unit_id' => $units->where('name', 'มิลลิลิตร')->first()->id,
                'image' => null,
            ],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }
    }
}
