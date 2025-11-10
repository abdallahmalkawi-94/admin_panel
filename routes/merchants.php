<?php

use App\Http\Controllers\MerchantController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("merchants")->group(function () {
        Route::get("/", [MerchantController::class, "index"])->name("merchants.index");
        Route::get("/parent-merchants-by-product", [MerchantController::class, "getParentMerchantsByProduct"])->name("merchants.parent-by-product");
        Route::get("/create", [MerchantController::class, "create"])->name("merchants.create");
        Route::post("/", [MerchantController::class, "store"])->name("merchants.store");
        Route::get("/{merchant}", [MerchantController::class, "show"])->name("merchants.show");
        Route::get("/{merchant}/edit", [MerchantController::class, "edit"])->name("merchants.edit");
        Route::patch("/{merchant}", [MerchantController::class, "update"])->name("merchants.update");
        Route::delete("/{merchant}", [MerchantController::class, "destroy"])->name("merchants.destroy");
    });
});

