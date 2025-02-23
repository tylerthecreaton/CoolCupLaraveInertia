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
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        // Clear existing data
        Role::query()->delete();
        Permission::query()->delete();

        // Define permissions based on Route requirements
        $permissions = [
            'view dashboard' => ['admin', 'manager'],              // Dashboard, Notifications, Telegram
            'manage users' => ['admin', 'manager'],                // Admin Users
            'manage categories' => ['admin', 'manager'],           // Admin Categories
            'manage products' => ['admin', 'manager', 'employee'], // Products, Product Ingredients, Product Consumables, Promotions
            'manage orders' => ['admin', 'manager', 'employee'],   // Orders (implicitly covered in routes)
            'view reports' => ['admin', 'manager'],                // Admin Reports
            'manage inventory' => ['admin', 'manager'],            // Ingredients, Consumables, Lots, Transactions, etc.
            'manage settings' => ['admin'],                        // Admin Settings
        ];

        // Create permissions
        foreach ($permissions as $permission => $roles) {
            Permission::create(['name' => $permission]);
        }

        // Define roles and their permissions
        $roles = [
            'admin' => array_keys($permissions), // Full access
            'manager' => [
                'view dashboard',
                'manage users',
                'manage categories',
                'manage products',
                'manage orders',
                'view reports',
                'manage inventory',
            ],
            'employee' => [
                'manage products',
                'manage orders',
            ],
        ];

        // Create roles and assign permissions
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::create(['name' => $roleName]);
            $role->givePermissionTo($rolePermissions);
        }
    }
}
