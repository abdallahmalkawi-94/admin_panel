<?php

use App\Http\Controllers\FeesCollectionModelController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('fees-collection-model')->group(function () {
        Route::get('/{pspPaymentMethod}/create', [FeesCollectionModelController::class, 'create'])->name('fees-collection-model.create');
        Route::post('/{pspPaymentMethod}', [FeesCollectionModelController::class, 'store'])->name('fees-collection-model.store');
    });
});
