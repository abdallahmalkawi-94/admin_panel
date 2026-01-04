<?php

namespace Database\Seeders;

use App\Models\Bank;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = json_decode(
            file_get_contents(storage_path('banks.json')),
            true
        );
        foreach ($banks as $bank) {
            Bank::query()->updateOrCreate(
                [
                    'swift_code' => $bank['swift_code'],
                    'country_code' => $bank['code'],
                ],
                [
                    'en_name' => $bank['en_name'],
                    'ar_name' => $bank['ar_name'],
                ]
            );
        }

    }
}
