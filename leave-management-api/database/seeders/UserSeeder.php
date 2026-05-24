<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
{
    // Manager
    User::create([
        'name' => 'Manager User',
        'email' => 'manager@example.com',
        'password' => bcrypt('password'),
        'role' => 'manager'
    ]);
    
    // Employees
    User::create([
        'name' => 'John Employee',
        'email' => 'john@example.com',
        'password' => bcrypt('password'),
        'role' => 'employee'
    ]);
    
        User::create([
            'name' => 'Jane Employee',
            'email' => 'jane@example.com',
            'password' => bcrypt('password'),
            'role' => 'employee'
        ]);
    }
}
