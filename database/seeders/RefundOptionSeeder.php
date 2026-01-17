<?php

namespace Database\Seeders;

use App\Constants\refund_option;
use App\Models\RefundOption;
use Illuminate\Database\Seeder;

class RefundOptionSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        RefundOption::query()->firstOrCreate([
            'code' => refund_option::NO_REFUND,
        ], [
            'description' => 'No Refund'
        ]);

        RefundOption::query()->firstOrCreate([
            'code' => refund_option::ONE_TIME_REFUND,
        ], [
            'description' => 'One Time Refund'
        ]);

        RefundOption::query()->firstOrCreate([
            'code' => refund_option::MULTIPLE_REFUNDS,
        ], [
            'description' => 'Multiple Refunds'
        ]);
    }
}
