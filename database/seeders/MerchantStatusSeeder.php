<?php

namespace Database\Seeders;

use App\Models\MerchantStatus;
use Illuminate\Database\Seeder;

class MerchantStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'code' => MerchantStatus::ACTIVE,
                'description' => 'Active'
            ],
            [
                'code' => MerchantStatus::IN_ACTIVE,
                'description' => 'Inactive'
            ],
            [
                'code' => MerchantStatus::SUSPENDED,
                'description' => 'Suspended'
            ]

        ];

        MerchantStatus::query()->upsert($statuses, ["code"]);
    }
}
