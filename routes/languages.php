<?php

use App\Http\Controllers\LanguageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("languages")->group(function () {
        Route::get("/", [LanguageController::class, "index"])->name("languages.index");
        Route::get("/{language}", [LanguageController::class, "show"])->name("languages.show");
    });
});

