<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'ชา', 'image' => 'https://via.placeholder.com/150', 'description' => 'เครื่องดื่มประเภทชา'],
            ['name' => 'กาแฟ', 'image' => 'https://via.placeholder.com/150', 'description' => 'เครื่องดื่มประเภทกาแฟ'],
            ['name' => 'ท๊อปปิ้ง', 'image' => 'https://via.placeholder.com/150', 'description' => 'ท็อปปิ้งสำหรับเครื่องดื่ม'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
