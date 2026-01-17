<?php

use App\Http\Controllers\PaymentMethodController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("payment-methods")->group(function () {
        Route::get("/", [PaymentMethodController::class, "index"])->name("payment-methods.index");
        Route::get("/create", [PaymentMethodController::class, "create"])->name("payment-methods.create");
        Route::post("/", [PaymentMethodController::class, "store"])->name("payment-methods.store");
        Route::get("/{paymentMethod}", [PaymentMethodController::class, "show"])->name("payment-methods.show");
        Route::get("/{paymentMethod}/edit", [PaymentMethodController::class, "edit"])->name("payment-methods.edit");
        Route::patch("/{paymentMethod}", [PaymentMethodController::class, "update"])->name("payment-methods.update");
        Route::delete("/{paymentMethod}", [PaymentMethodController::class, "destroy"])->name("payment-methods.destroy");
    });
});
