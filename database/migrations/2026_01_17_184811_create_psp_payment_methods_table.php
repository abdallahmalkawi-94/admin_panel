<?php

use App\Constants\subscription_model;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('psp_payment_methods', function (Blueprint $table) {
            $table->id();
            $table->foreignId("psp_id")->references("id")->on("psps");
            $table->foreignId("payment_method_id")->references("id")->on("payment_methods");
            $table->foreignId("merchant_id")->nullable()->references("id")->on("merchants");
            $table->foreignId("invoice_type_id")->nullable()->references("id")->on("invoice_types");
            $table->foreignId('refund_option_id')->references('id')->on('refund_options');
            $table->foreignId("payout_model_id")->references("id")->on("payout_models");
            $table->boolean("support_tokenization")->default(false);
            $table->tinyInteger("subscription_model")->default(subscription_model::REVENUE_SHARING);
            $table->boolean('is_active')->default(true);
            $table->boolean("shown_in_checkout")->default(true);
            $table->boolean("support_international_payment")->default(false);
            $table->boolean("post_fees_to_psp")->default(false);
            $table->tinyInteger("fees_type")->default(0);
            $table->integer("priority");
            $table->bigInteger("max_allowed_amount");
            $table->bigInteger("min_allowed_amount");
            $table->jsonb("config");
            $table->jsonb("test_config");
            $table->foreignId('created_by')->nullable()->references('id')->on('users');
            $table->foreignId('updated_by')->nullable()->references('id')->on('users');
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['psp_id', 'payment_method_id', 'merchant_id', 'invoice_type_id'], 'unique_psp_payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psp_payment_methods');
    }
};
