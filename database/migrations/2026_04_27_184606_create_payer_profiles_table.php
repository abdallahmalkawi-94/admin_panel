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
        Schema::create('payer_profiles', function (Blueprint $table) {
            $table->id();
            $table->string("full_name");
            $table->string("username");
            $table->unsignedBigInteger("referral_id")->nullable();
            $table->string("email");
            $table->string("mobile_number");
            $table->foreignId("product_id")->references("id")->on("products");
            $table->foreignId('merchant_id')->nullable()->references("id")->on("merchants");
            $table->smallInteger("status");
            $table->integer("total_points")->default(0);
            $table->string("identity_no")->nullable();
            $table->smallInteger("identity_type_id")->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['referral_id', 'product_id'], 'referral_id_product_id_idx');
            $table->unique(['email']);
            $table->unique(['mobile_number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payer_profiles');
    }
};
