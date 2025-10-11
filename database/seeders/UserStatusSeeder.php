<?php

namespace Database\Seeders;

use App\Http\Constants\UserStatusConstants;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'id' => UserStatusConstants::ACTIVE,
                'description' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => UserStatusConstants::IN_ACTIVE,
                'description' => 'Inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => UserStatusConstants::PENDING_VERIFICATION,
                'description' => 'Pending Verification',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => UserStatusConstants::BLOCKED,
                'description' => 'Blocked',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('user_statuses')->insertOrIgnore($statuses);
    }
}
