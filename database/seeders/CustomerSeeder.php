<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = [
            [
                'name' => 'ณฐกฤษฎิ์ ธรรมธัชติสรณ์',
                'phone_number' => '0942017100',
                'birthdate' => '2002-05-20',
                'loyalty_points' => 100,
            ],
            [
                'name' => 'สมหญิง รักสวย',
                'phone_number' => '0823456789',
                'birthdate' => '1995-08-20',
                'loyalty_points' => 50,
            ],
            [
                'name' => 'วิชัย ชอบกาแฟ',
                'phone_number' => '0834567890',
                'birthdate' => '1985-12-10',
                'loyalty_points' => 75,
            ],
            [
                'name' => 'นภา ชอบชา',
                'phone_number' => '0845678901',
                'birthdate' => '1992-03-25',
                'loyalty_points' => 25,
            ],
        ];

        foreach ($customers as $customer) {
            Customer::create($customer);
        }
    }
}
