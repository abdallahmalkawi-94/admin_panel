<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('dashboard');
//})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
