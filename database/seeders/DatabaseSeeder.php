<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
//            WorldSeeder::class,
            InvoiceTypeSeeder::class,
            PspStatusSeeder::class,
            UserStatusSeeder::class,
            UserSeeder::class,
            MerchantStatusSeeder::class,
            TermsAndConditionSeeder::class,
            PayoutModelsSeeder::class,
            RefundOptionsSeeder::class,
        ]);
    }
}
