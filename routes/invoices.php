<?php

use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("invoices")->group(function () {
        Route::get("/one-time-payment", [InvoiceController::class, "create"])->name("invoices.one-time-payment.create");
        Route::get("/merchant-context", [InvoiceController::class, "merchantContext"])
            ->middleware('throttle:60,1')
            ->name("invoices.merchant-context");
        Route::get("/payer-profile-by-email", [InvoiceController::class, "payerProfileByEmail"])
            ->middleware('throttle:60,1')
            ->name("invoices.payer-profile-by-email");
        Route::post("/", [InvoiceController::class, "store"])->name("invoices.store");
    });
});
