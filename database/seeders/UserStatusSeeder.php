<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_statuses')->updateOrInsert(
            ['description' => 'ACTIVE'],
            ['updated_at' => now()]
        );
        DB::table('user_statuses')->updateOrInsert(
            ['description' => 'IN_ACTIVE'],
            ['updated_at' => now()]
        );
        DB::table('user_statuses')->updateOrInsert(
            ['description' => 'PENDING_VERIFICATION'],
            ['updated_at' => now()]
        );
        DB::table('user_statuses')->updateOrInsert(
            ['description' => 'BLOCKED'],
            ['updated_at' => now()]
        );
    }
}
