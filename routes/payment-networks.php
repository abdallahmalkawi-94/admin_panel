<?php

use App\Http\Controllers\PaymentNetworkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("payment-networks")->group(function () {
        Route::get("/", [PaymentNetworkController::class, "index"])->name("payment-networks.index");
        Route::get("/create", [PaymentNetworkController::class, "create"])->name("payment-networks.create");
        Route::post("/", [PaymentNetworkController::class, "store"])->name("payment-networks.store");
        Route::get("/{paymentNetwork}", [PaymentNetworkController::class, "show"])->name("payment-networks.show");
        Route::get("/{paymentNetwork}/edit", [PaymentNetworkController::class, "edit"])->name("payment-networks.edit");
        Route::patch("/{paymentNetwork}", [PaymentNetworkController::class, "update"])->name("payment-networks.update");
        Route::delete("/{paymentNetwork}", [PaymentNetworkController::class, "destroy"])->name("payment-networks.destroy");
    });
});
