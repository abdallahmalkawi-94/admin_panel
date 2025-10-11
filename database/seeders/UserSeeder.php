<?php

namespace Database\Seeders;

use App\Http\Constants\UserStatusConstants;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Nnjeim\World\Models\Country;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
//        User::factory()->count(100)->create();
        User::query()->firstOrCreate([
            "email" => "a.malkawi@classera.com"
        ], [
            "name" => "Abdallah Malkawi",
            "country_code" => Country::query()
                ->select(["id", "iso2"])
                ->where('iso2', "JO")
                ->first()
                ->getAttribute("iso2"),
            "mobile_number" => "+962775633700",
            "status_id" => UserStatusConstants::ACTIVE,
            "password" => Hash::make("password"),
            "email_verified_at" => now()
        ]);
    }
}
