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
        Schema::create('merchant_invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('merchant_id')->references('id')->on('merchants');
            $table->foreignId('invoice_type_id')->references('id')->on('invoice_types');

            $table->unique(['merchant_id', 'invoice_type_id']);
            $table->SoftDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchant_invoices');
    }
};
