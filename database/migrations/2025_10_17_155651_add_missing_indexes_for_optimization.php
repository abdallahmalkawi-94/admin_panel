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
        // Add index on users.country_code (foreign key used in filters)
        Schema::table('users', function (Blueprint $table) {
            $table->index('country_code', 'idx_users_country_code');
        });

        // Add index on users.status_id (foreign key used in filters)
        Schema::table('users', function (Blueprint $table) {
            $table->index('status_id', 'idx_users_status_id');
        });

        // Add index on countries.status (used in WHERE clauses)
        Schema::table('countries', function (Blueprint $table) {
            $table->index('status', 'idx_countries_status');
        });

        // Add index on countries.region (used in filters and distinct queries)
        Schema::table('countries', function (Blueprint $table) {
            $table->index('region', 'idx_countries_region');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex('idx_users_country_code');
            $table->dropIndex('idx_users_status_id');
        });

        Schema::table('countries', function (Blueprint $table) {
            $table->dropIndex('idx_countries_status');
            $table->dropIndex('idx_countries_region');
        });
    }
};
