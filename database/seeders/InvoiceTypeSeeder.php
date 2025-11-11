<?php

namespace Database\Seeders;

use App\Models\InvoiceType;
use Illuminate\Database\Seeder;

class InvoiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InvoiceType::firstOrCreate([
            'code' => InvoiceType::TUITION_FEES,
        ], [
            'description' => 'Tuition Fees',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::SCHOOL_CLUB,
        ], [
            'description' => 'School Club',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::E_COMMERCE,
        ], [
            'description' => 'E-commerce',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::ONLINE_COURSE,
        ], [
            'description' => 'Online Course',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::REGISTRATION_FEES,
        ], [
            'description' => 'Registration Fees',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::CANTEEN_POINTS,
        ], [
            'description' => 'Canteen Points',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::ERP_PAYMENT,
        ], [
            'description' => 'ERP Payment',
        ]);

        InvoiceType::firstOrCreate([
            'code' => InvoiceType::CWALLET_MONEY_IN,
        ], [
            'description' => 'CWallet Money In',
        ]);
    }
}
