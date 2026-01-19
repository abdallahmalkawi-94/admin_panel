<?php

use App\Http\Controllers\PspPaymentMethodController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("psp-payment-methods")->group(function () {
        Route::get("/", [PspPaymentMethodController::class, "index"])->name("psp-payment-methods.index");
        Route::get("/create", [PspPaymentMethodController::class, "create"])->name("psp-payment-methods.create");
        Route::post("/", [PspPaymentMethodController::class, "store"])->name("psp-payment-methods.store");
        Route::get("/{pspPaymentMethod}", [PspPaymentMethodController::class, "show"])->name("psp-payment-methods.show");
        Route::get("/{pspPaymentMethod}/edit", [PspPaymentMethodController::class, "edit"])->name("psp-payment-methods.edit");
        Route::patch("/{pspPaymentMethod}", [PspPaymentMethodController::class, "update"])->name("psp-payment-methods.update");
        Route::delete("/{pspPaymentMethod}", [PspPaymentMethodController::class, "destroy"])->name("psp-payment-methods.destroy");
    });
});
