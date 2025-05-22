<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BusinessTypeController;
use App\Http\Controllers\ApplicationTypeController;
use App\Http\Controllers\ZoningController;
use App\Http\Controllers\ProponentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\VerificationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/send-verification', [AuthController::class, 'sendVerificationEmail']);
Route::post('/verify', [AuthController::class, 'verifyCode']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth-check', [AuthController::class, 'authCheck']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'index']);
    Route::apiResource('/zonings',ZoningController::class);
    Route::apiResource('/application-types',ApplicationTypeController::class);
    Route::apiResource('/business-types',BusinessTypeController::class);
    Route::apiResource('/proponents',ProponentController::class);
});