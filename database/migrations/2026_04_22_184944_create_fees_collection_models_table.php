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
        Schema::create('fees_collection_models', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_default')->default(false);
            $table->foreignId('psp_payment_method_id')->nullable()->references('id')->on('psp_payment_methods');
            $table->foreignId('merchant_id')->nullable()->references('id')->on('merchants');
            $table->foreignId('invoice_type_id')->nullable()->references('id')->on('invoice_types');
            $table->decimal('from', 15, 5)->default(0);
            $table->decimal('to', 15, 5)->nullable();
            $table->decimal('foc_fixed', 15, 5)->default(0);
            $table->decimal('fom_fixed', 15, 5)->default(0);
            $table->decimal('foc_percentage', 15, 5)->default(0);
            $table->decimal('fom_percentage', 15, 5)->default(0);
            $table->decimal('foc_psp_cost_fixed', 15, 5)->default(0);
            $table->decimal('fom_psp_cost_fixed', 15, 5)->default(0);
            $table->decimal('fom_psp_cost_percentage', 15, 5)->default(0);
            $table->decimal('foc_psp_cost_percentage', 15, 5)->default(0);
            $table->decimal('installment_fom_fixed', 15, 5)->default(0);
            $table->decimal('installment_fom_percentage', 15, 5)->default(0);
            $table->decimal('installment_foc_fixed', 15, 5)->default(0);
            $table->decimal('installment_foc_percentage', 15, 5)->default(0);
            $table->foreignId('created_by')->nullable()->references('id')->on('users');
            $table->foreignId('updated_by')->nullable()->references('id')->on('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fees_collection_models');
    }
};
