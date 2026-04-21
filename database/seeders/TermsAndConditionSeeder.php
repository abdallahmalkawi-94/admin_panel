<?php

namespace Database\Seeders;

use App\Models\TermsAndCondition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TermsAndConditionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $terms = [
            [
                "country_code" => null,
                "version" => 1,
                "description" => "Default Terms and Condition",
            ],
        ];

        TermsAndCondition::query()->upsert($terms, ["country_code", "version"]);
    }
}
