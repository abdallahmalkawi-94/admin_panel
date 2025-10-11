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
        Schema::table('countries', function (Blueprint $table) {
            $table->index(['iso2']);
        });

        Schema::table('currencies', function (Blueprint $table) {
            $table->index(['code']);
        });

        Schema::table('languages', function (Blueprint $table) {
            $table->index(['code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('countries', function (Blueprint $table) {
            $table->dropIndex(['iso2']);
        });

        Schema::table('currencies', function (Blueprint $table) {
            $table->dropIndex(['code']);
        });

        Schema::table('languages', function (Blueprint $table) {
            $table->dropIndex(['code']);
        });
    }
};
