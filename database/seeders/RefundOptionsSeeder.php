<?php

namespace Database\Seeders;

use App\Models\RefundOption;
use Illuminate\Database\Seeder;

class RefundOptionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            ["code" => RefundOption::NO_REFUND, "description" => "No Refund"],
            ["code" => RefundOption::ONE_TIME_REFUND, "description" => "One Time Refund"],
            ["code" => RefundOption::MULTIPLE_REFUNDS, "description" => "Multiple Refunds"],
        ];

        RefundOption::query()->upsert($options, ["code"]);
    }
}
