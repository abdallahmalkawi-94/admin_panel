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
        Schema::create('merchant_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId("merchant_id")->references("id")->on("merchants");
            $table->smallInteger("payout_model")->default(1)->comment("1 => manual, 2 => daily, 3 => weekly , 4 => monthly, 5 => annual");
            $table->foreignId("bank_id")->nullable()->references("id")->on("banks");
            $table->string("iban")->nullable();
            $table->string("bank_account_no")->nullable();
            $table->smallInteger("supported_order_type")->comment("push or pull");
            $table->boolean("has_custom_urls")->default(false);
            $table->jsonb("urls_settings")->nullable()->comment("callback_url, webhook_url, invoice_inquiry_url, invoice_creation_url, token_key");
            $table->string("attachment")->nullable();
            $table->foreignId("terms_and_condition_id")->references("id")->on("terms_and_conditions");
            $table->boolean("is_enable_sms_notification")->default(false);
            $table->integer("monthly_sms")->default(0);
            $table->integer("monthly_sms_counter")->default(0);
            $table->integer("daily_sms")->default(0);
            $table->integer("daily_sms_counter")->default(0);
            $table->boolean("is_enable_email_notification")->default(false);

            $table->boolean("is_enable_auto_redirect")->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchant_settings');
    }
};
