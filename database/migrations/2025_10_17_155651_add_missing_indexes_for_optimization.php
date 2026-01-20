<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add index on users.country_code (foreign key used in filters)
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'country_code')) {
            if (!$this->indexExists('users', 'idx_users_country_code')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->index('country_code', 'idx_users_country_code');
                });
            }
        }

        // Add index on users.status_id (foreign key used in filters)
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'status_id')) {
            if (!$this->indexExists('users', 'idx_users_status_id')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->index('status_id', 'idx_users_status_id');
                });
            }
        }

        // Add index on countries.status (used in WHERE clauses)
        if (Schema::hasTable('countries') && Schema::hasColumn('countries', 'status')) {
            if (!$this->indexExists('countries', 'idx_countries_status')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->index('status', 'idx_countries_status');
                });
            }
        }

        // Add index on countries.region (used in filters and distinct queries)
        if (Schema::hasTable('countries') && Schema::hasColumn('countries', 'region')) {
            if (!$this->indexExists('countries', 'idx_countries_region')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->index('region', 'idx_countries_region');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users')) {
            if ($this->indexExists('users', 'idx_users_country_code')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->dropIndex('idx_users_country_code');
                });
            }
            if ($this->indexExists('users', 'idx_users_status_id')) {
                Schema::table('users', function (Blueprint $table) {
                    $table->dropIndex('idx_users_status_id');
                });
            }
        }

        if (Schema::hasTable('countries')) {
            if ($this->indexExists('countries', 'idx_countries_status')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->dropIndex('idx_countries_status');
                });
            }
            if ($this->indexExists('countries', 'idx_countries_region')) {
                Schema::table('countries', function (Blueprint $table) {
                    $table->dropIndex('idx_countries_region');
                });
            }
        }
    }

    private function indexExists(string $table, string $indexName): bool
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            $result = DB::select(
                'select 1 from pg_indexes where tablename = ? and indexname = ? limit 1',
                [$table, $indexName]
            );
            return !empty($result);
        }

        if ($driver === 'sqlite') {
            $indexes = DB::select("pragma index_list('{$table}')");
            foreach ($indexes as $index) {
                if (($index->name ?? null) === $indexName) {
                    return true;
                }
            }
            return false;
        }

        $result = DB::select(
            'select 1 from information_schema.statistics where table_schema = database() and table_name = ? and index_name = ? limit 1',
            [$table, $indexName]
        );
        return !empty($result);
    }
};
