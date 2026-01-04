<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table("users", function (Blueprint $table) {
            $table->string("country_code", 2);
            $table->foreign("country_code")->references("iso2")->on("countries");
        });

        Schema::table("banks", function (Blueprint $table) {
            $table->string("country_code", 2);
            $table->foreign("country_code")->references("iso2")->on("countries");

            $table->unique(['swift_code', 'country_code']);
        });

        Schema::table("merchant_settings", function (Blueprint $table) {
            $table->string("country_code", 2);
            $table->foreign("country_code")->references("iso2")->on("countries");

            $table->string("currency_code", 3);
            $table->foreign("currency_code")->references("code")->on("currencies");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('merchant_settings', function (Blueprint $table) {
            $table->dropForeign(['country_code']);
            $table->dropForeign(['currency_code']);
            $table->dropColumn(['country_code', 'currency_code']);
        });

        Schema::table('banks', function (Blueprint $table) {
            $table->dropForeign(['country_code']);
            $table->dropColumn(['country_code']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['country_code']);
            $table->dropColumn(['country_code']);
        });
    }
};
