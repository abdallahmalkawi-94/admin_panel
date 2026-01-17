<?php

namespace Database\Seeders;

use App\Constants\payout_models;
use App\Models\PayoutModel;
use Illuminate\Database\Seeder;

class PayoutModelSeeder extends Seeder {

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * PayoutModel
         */
        PayoutModel::query()->firstOrCreate([
            'code' => payout_models::WEEKLY,
        ], [
            'description' => 'Weekly'
        ]);

        PayoutModel::query()->firstOrCreate([
            'code' => payout_models::BIWEEKLY,
        ], [
            'description' => 'Bi-Weekly'
        ]);

        PayoutModel::query()->firstOrCreate([
            'code' => payout_models::MONTHLY,
        ], [
            'description' => 'Monthly'
        ]);

        PayoutModel::query()->firstOrCreate([
            'code' => payout_models::EVERY_THREE_MONTH,
        ], [
            'description' => 'Every Three Months'
        ]);

        PayoutModel::query()->firstOrCreate([
            'code' => payout_models::SIMI_ANNUAL,
        ], [
            'description' => 'Simi Annual'
        ]);
    }
}
