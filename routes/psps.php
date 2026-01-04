<?php

use App\Http\Controllers\PspController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("psps")->group(function () {
        Route::get("/", [PspController::class, "index"])->name("psps.index");
        Route::get("/create", [PspController::class, "create"])->name("psps.create");
        Route::post("/", [PspController::class, "store"])->name("psps.store");
        Route::get("/{psp}", [PspController::class, "show"])->name("psps.show");
        Route::get("/{psp}/edit", [PspController::class, "edit"])->name("psps.edit");
        Route::patch("/{psp}", [PspController::class, "update"])->name("psps.update");
        Route::delete("/{psp}", [PspController::class, "destroy"])->name("psps.destroy");
    });
});

