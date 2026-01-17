<?php

use App\Http\Controllers\MessageTypeController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("message-types")->group(function () {
        Route::get("/", [MessageTypeController::class, "index"])->name("message-types.index");
    });
});
