<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('terms_and_conditions', function (Blueprint $table) {
            $table->string("country_code", 2)->nullable();
            $table->foreign("country_code")->references("iso2")->on("countries");
            $table->unique(["country_code", "version"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('terms_and_conditions', function (Blueprint $table) {
            $table->dropUnique(["country_code", "version"]);
            $table->dropForeign("terms_and_conditions_country_code_foreign");
            $table->dropColumn("country_code");
        });
    }
};
