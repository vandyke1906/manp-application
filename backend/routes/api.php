<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BusinessTypeController;
use App\Http\Controllers\ApplicationTypeController;
use App\Http\Controllers\ZoningController;
use App\Http\Controllers\ProponentController;
use App\Http\Controllers\AuthController;

use Illuminate\Session\Middleware\StartSession;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::get('/users', [AuthController::class, 'index']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth-check', [AuthController::class, 'authCheck']);
    Route::apiResource('/zonings',ZoningController::class);
    Route::apiResource('/application-types',ApplicationTypeController::class);
    Route::apiResource('/business-types',BusinessTypeController::class);
    Route::apiResource('/proponents',ProponentController::class);
});