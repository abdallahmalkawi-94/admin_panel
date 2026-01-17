<?php

namespace Database\Seeders;

use App\Constants\invoice_types;
use App\Models\InvoiceType;
use Illuminate\Database\Seeder;

class InvoiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::TUITION_FEES,
        ], [
            'description' => 'Tuition Fees',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::SCHOOL_CLUB,
        ], [
            'description' => 'School Club',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::E_COMMERCE,
        ], [
            'description' => 'E-commerce',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::ONLINE_COURSE,
        ], [
            'description' => 'Online Course',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::REGISTRATION_FEES,
        ], [
            'description' => 'Registration Fees',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::CANTEEN_POINTS,
        ], [
            'description' => 'Canteen Points',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::ERP_PAYMENT,
        ], [
            'description' => 'ERP Payment',
        ]);

        InvoiceType::query()->firstOrCreate([
            'code' => invoice_types::CWALLET_MONEY_IN,
        ], [
            'description' => 'CWallet Money In',
        ]);
    }
}
