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
        Schema::create('merchants', function (Blueprint $table) {
            $table->id();
            $table->string('en_name');
            $table->string('ar_name');
            $table->string("commercial_registry_name")->nullable();
            $table->foreignId("product_id")->references("id")->on("products");
            $table->integer("referral_id");
            $table->foreignId("parent_merchant_id")->nullable()->references("id")->on("merchants");
            $table->foreignId("status_id")->references("id")->on("merchant_statuses");
            $table->boolean("is_live")->default(false);
            $table->string("logo_url")->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchants');
    }
};
