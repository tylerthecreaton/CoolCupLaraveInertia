<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleAndPermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Clear existing roles and permissions
        Role::query()->delete();
        Permission::query()->delete();

        // Create permissions
        Permission::create(['name' => 'view dashboard']);
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'manage products']);
        Permission::create(['name' => 'manage orders']);
        Permission::create(['name' => 'view reports']);
        Permission::create(['name' => 'manage inventory']);

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'view dashboard',
            'manage users',
            'manage products',
            'manage orders',
            'view reports',
            'manage inventory',
        ]);

        // Create manager role with most permissions except user management
        $managerRole = Role::create(['name' => 'manager']);
        $managerRole->givePermissionTo([
            'view dashboard',
            'manage products',
            'manage orders',
            'view reports',
            'manage inventory'
        ]);

        // Create employee role with limited permissions
        $employeeRole = Role::create(['name' => 'employee']);
        $employeeRole->givePermissionTo([
            'manage products',
            'manage orders'
        ]);
    }
}
