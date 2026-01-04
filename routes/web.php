<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

//Route::get('/', function () {
//    return Inertia::render('dashboard');
//})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

require __DIR__.'/users.php';
require __DIR__.'/products.php';
require __DIR__.'/countries.php';
require __DIR__.'/currencies.php';
require __DIR__.'/languages.php';
require __DIR__.'/merchants.php';
require __DIR__.'/banks.php';
require __DIR__.'/psps.php';
