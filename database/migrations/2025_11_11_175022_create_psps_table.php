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
        Schema::create('psps', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code')->unique();
            $table->string("country_code", 2);
            $table->foreign("country_code")->references("iso2")->on("countries");
            $table->string("settlement_currency_code", 3);
            $table->foreign("settlement_currency_code")->references("code")->on("currencies");
            $table->decimal('monthly_fees', 10, 5);
            $table->foreignId('psp_status_id')->references('id')->on('psp_statuses');
            $table->string('contact_person')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('base_url')->nullable();
            $table->string('sdk_version')->nullable();
            $table->string('dashboard_url')->nullable();
            $table->boolean('support_money_splitting')->default(0);
            $table->text('notes')->nullable();
//            $table->foreignId('accessibility_mode_id')->default(1)->references('id')->on('psp_accessibility_modes');
            $table->string('attachment' , 255)->nullable();
            $table->string('password')->nullable();
            $table->foreignId('bank_id')->nullable()->references('id')->on('banks');
            $table->string('bank_account_number')->nullable();
            $table->string('swift_code')->nullable();
            $table->string('iban')->nullable();
            $table->boolean('enable_auto_transfer')->default(false);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('psps');
    }
};
