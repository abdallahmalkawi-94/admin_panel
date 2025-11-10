<?php

use App\Http\Controllers\BankController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("banks")->group(function () {
        Route::get("/", [BankController::class, "index"])->name("banks.index");
        Route::get("/create", [BankController::class, "create"])->name("banks.create");
        Route::post("/", [BankController::class, "store"])->name("banks.store");
        Route::get("/{bank}", [BankController::class, "show"])->name("banks.show");
        Route::get("/{bank}/edit", [BankController::class, "edit"])->name("banks.edit");
        Route::patch("/{bank}", [BankController::class, "update"])->name("banks.update");
        Route::delete("/{bank}", [BankController::class, "destroy"])->name("banks.destroy");
    });
});

