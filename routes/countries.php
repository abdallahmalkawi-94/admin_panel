<?php

use App\Http\Controllers\CountryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("countries")->group(function () {
        Route::get("/", [CountryController::class, "index"])->name("countries.index");
        Route::get("/{country}", [CountryController::class, "show"])->name("countries.show");
//        Route::get("/{country}/edit", [CountryController::class, "edit"])->name("countries.edit");
//        Route::patch("/{country}", [CountryController::class, "update"])->name("countries.update");
//        Route::delete("/{country}", [CountryController::class, "destroy"])->name("countries.destroy");
//        Route::get("/create", [CountryController::class, "create"])->name("countries.create");
//        Route::post("/", [CountryController::class, "store"])->name("countries.store");
    });
});

