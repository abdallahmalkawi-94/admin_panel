<?php

namespace Database\Seeders;

use App\Models\PayoutModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PayoutModelsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $models = [
            ["code" => 1, "description" => "Manual"],
            ["code" => 2, "description" => "Daily"],
            ["code" => 3, "description" => "Weekly"],
            ["code" => 4, "description" => "Monthly"],
            ["code" => 5, "description" => "Annual"],
        ];

        PayoutModel::query()->upsert($models, ["code"]);
    }
}
