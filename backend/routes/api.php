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
use App\Http\Controllers\ApprovalController;

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
    Route::get('/applicant-types/by-ids', [ApplicantTypeController::class, 'getByIds']);

    Route::get('/applications-file/{id}/{name}', [ApplicationController::class, 'getApplicationFile']);
    Route::apiResource('/applications',ApplicationController::class);

    Route::apiResource('/zonings',ZoningController::class);
    Route::apiResource('/application-types',ApplicationTypeController::class);
    Route::apiResource('/business-types',BusinessTypeController::class);
    Route::apiResource('/applicant-types',ApplicantTypeController::class);
    Route::apiResource('/capitalizations',CapitalizationController::class);
    Route::apiResource('/business-natures',BusinessNatureController::class);
    Route::apiResource('/business-statuses',BusinessStatusController::class);  
    Route::apiResource('/approvals',ApprovalController::class); 
    Route::post('/approvals/{id}/confirm-submission', [ApprovalController::class, 'confirmDocumentsSubmission']);    
});

Route::get('/download-file/{business_name}/{file_name}', function ($business_name, $file_name) {
    if (!request()->hasValidSignature()) {
        abort(403, 'Unauthorized access');
    }
    $path = storage_path("app/private/application_files/{$business_name}/{$file_name}");
    if (!file_exists($path)) {
        return response()->json(['message' => 'File not found'], 404);
    }
    return response()->file($path, ['Content-Type' => mime_content_type($path)]);
})->name('download-file');


Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->middleware(['signed'])->name('verification.verify');


//test here
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
