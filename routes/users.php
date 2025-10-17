<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix("users")->group(function () {
        Route::get("/", [UserController::class, "index"])->name("users.index");
        Route::get("/create", [UserController::class, "create"])->name("users.create");
        Route::post("/", [UserController::class, "store"])->name("users.store");
        Route::get("/{user}", [UserController::class, "show"])->name("users.show");
        Route::get("/{user}/edit", [UserController::class, "edit"])->name("users.edit");
        Route::patch("/{user}", [UserController::class, "update"])->name("users.update");
        Route::delete("/{user}", [UserController::class, "destroy"])->name("users.destroy");
    });
});
