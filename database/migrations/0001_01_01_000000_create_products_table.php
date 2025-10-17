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

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('en_name');
            $table->string('ar_name');
            $table->boolean("signing_active")->default(false);
            $table->string('callback_url')->nullable();
            $table->string('webhook_url')->nullable();
            $table->string('hmac_key')->nullable();
            $table->string('token_key')->nullable();
            $table->string('secret_key');
            $table->string('invoice_inquiry_api')->nullable();
            $table->string('invoice_creation_api');
            $table->string('integration_type')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
