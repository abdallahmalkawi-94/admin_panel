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
        Schema::table('users', function (Blueprint $table) {
            // Index foreign keys and soft delete
            $table->index('deleted_at', "idx_users_deleted_at");
        });

        Schema::table('products', function (Blueprint $table) {
            // Soft delete index for large tables
            $table->index('deleted_at', "idx_products_deleted_at");
        });

        Schema::table('merchants', function (Blueprint $table) {
            // Index common lookup columns
            $table->index('referral_id', "idx_merchants_referral_id");
            $table->index('is_live', "idx_merchants_is_live");
            $table->index('deleted_at', "idx_merchants_deleted_at");
            $table->unique(['product_id', 'referral_id'], "unique_merchant_per_product");
        });

        Schema::table('merchant_settings', function (Blueprint $table) {
            // Enforce one-to-one merchant to settings, and index FKs
            $table->unique('merchant_id', "unique_merchant_settings_merchant_id");
        });

        Schema::table('banks', function (Blueprint $table) {
            // Swift code often unique when present
            $table->unique('swift_code', "unique_swift_code");
        });

        Schema::table('terms_and_conditions', function (Blueprint $table) {
            // Usually only one row per version
            $table->unique('version', "unique_terms_and_conditions_version");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex("idx_users_deleted_at");
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropIndex("idx_products_deleted_at");
        });

        Schema::table('merchants', function (Blueprint $table) {
            $table->dropIndex("idx_merchants_referral_id");
            $table->dropIndex("idx_merchants_is_live");
            $table->dropIndex("idx_merchants_deleted_at");
        });


        Schema::table('banks', function (Blueprint $table) {
            $table->dropUnique("unique_swift_code");
        });

        Schema::table('terms_and_conditions', function (Blueprint $table) {
            $table->dropUnique("unique_terms_and_conditions_version");
        });
    }
};


