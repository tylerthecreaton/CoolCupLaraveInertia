<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CreateUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);
        User::create([
            'name' => 'Manager',
            'username' => 'manager',
            'email' => 'manager@gmail.com',
            'password' => bcrypt('12345678'),
            'role' => 'manager',
        ]);
    }
}
