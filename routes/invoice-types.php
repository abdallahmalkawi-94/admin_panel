<?php

use App\Http\Controllers\InvoiceTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("invoice-types")->group(function () {
        Route::get("/", [InvoiceTypeController::class, "index"])->name("invoice-types.index");
        Route::get("/create", [InvoiceTypeController::class, "create"])->name("invoice-types.create");
        Route::post("/", [InvoiceTypeController::class, "store"])->name("invoice-types.store");
        Route::get("/{invoiceType}/edit", [InvoiceTypeController::class, "edit"])->name("invoice-types.edit");
        Route::patch("/{invoiceType}", [InvoiceTypeController::class, "update"])->name("invoice-types.update");
    });
});
