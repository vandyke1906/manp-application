<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BusinessTypeController;
use App\Http\Controllers\ApplicationTypeController;
use App\Http\Controllers\ZoningController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ApplicantTypeController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BusinessStatusController;
use App\Http\Controllers\BusinessNatureController;
use App\Http\Controllers\CapitalizationController;

use Illuminate\Support\Facades\Log;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/send-verification', [AuthController::class, 'sendVerificationEmail']);
Route::post('/verify', [AuthController::class, 'verifyCode']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth/check', [AuthController::class, 'authCheck']);
    Route::post('/auth/refresh', [AuthController::class, 'refreshToken']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'index']);
    Route::get('/users/profile', [AuthController::class, 'profile']);

    Route::apiResource('/applications',ApplicationController::class);
    Route::apiResource('/zonings',ZoningController::class);
    Route::apiResource('/application-types',ApplicationTypeController::class);
    Route::apiResource('/business-types',BusinessTypeController::class);
    Route::apiResource('/applicant-types',ApplicantTypeController::class);
    Route::apiResource('/capitalizations',CapitalizationController::class);
    Route::apiResource('/business-natures',BusinessNatureController::class);
    Route::apiResource('/business-statuses',BusinessStatusController::class);    

    Route::get('/files/{folder}/{filename}', function ($folder, $filename) {
        $path = storage_path("app/private/application_files/{$folder}/{$filename}");
        if (!file_exists($path)) {
            abort(404);
        }
        return response()->file($path);
    });

});


Route::get('/debug-csrf', function () {
    return response()->json([
        'csrf_token' => request()->cookie('XSRF-TOKEN'),
    ]);
});

Route::get('/auth/session-debug', function () {
    return response()->json([
        'session_id' => session()->getId(),
        'session_data' => session()->all(),
    ]);
});
