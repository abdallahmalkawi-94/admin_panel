<?php

namespace Database\Seeders;

use App\Http\Constants\PspStatusConstants;
use App\Models\PspStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PspStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'id' => PspStatusConstants::ACTIVE,
                'description' => 'Active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => PspStatusConstants::INACTIVE,
                'description' => 'Inactive',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => PspStatusConstants::SUSPENDED,
                'description' => 'Suspend',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        PspStatus::query()->insertOrIgnore($statuses);
    }
}
