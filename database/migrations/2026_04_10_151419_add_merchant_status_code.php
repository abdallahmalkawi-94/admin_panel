<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('merchant_statuses', function (Blueprint $table) {
            $table->unsignedSmallInteger('code')->nullable();
        });

        DB::table('merchant_statuses')->where('id', 1)->update(['code' => 1]);
        DB::table('merchant_statuses')->where('id', 2)->update(['code' => 2]);
        DB::table('merchant_statuses')->where('id', 3)->update(['code' => 3]);

        Schema::table('merchant_statuses', function (Blueprint $table) {
            $table->unique('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('merchant_statuses', function (Blueprint $table) {
            $table->dropUnique(['code']);
            $table->dropColumn('code');
        });
    }
};
