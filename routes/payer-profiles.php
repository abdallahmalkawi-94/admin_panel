<?php

use App\Http\Controllers\PayerProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('payer-profiles')->group(function () {
        Route::get('/', [PayerProfileController::class, 'index'])->name('payer-profiles.index');
        Route::get('/{payerProfile}', [PayerProfileController::class, 'show'])->name('payer-profiles.show');
    });
});
