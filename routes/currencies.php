<?php

use App\Http\Controllers\CurrencyController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("currencies")->group(function () {
        Route::get("/", [CurrencyController::class, "index"])->name("currencies.index");
        Route::get("/{currency}", [CurrencyController::class, "show"])->name("currencies.show");
    });
});

