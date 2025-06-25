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
use App\Http\Controllers\ApplicationFilesController;
use Illuminate\Support\Facades\Log;

// Route::options('/{any}', function () { return response()->json([], 204); })->where('any', '.*');
Route::options('/{any}', function () {
    return response()->json([], 204);
})->where('any', '.*');

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/send-verification', [AuthController::class, 'sendVerificationEmail']);
Route::post('/verify', [AuthController::class, 'verifyCode']);
Route::post('/request-verification-link', [AuthController::class, 'sendVerificationLink']);
Route::post('/request-password-reset', [AuthController::class, 'sendResetPassword']);
Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])->middleware(['signed'])->name('verification.verify');//name added for jobs in SendVerificationLink.php
Route::post('/password-reset/{email}/{hash}', [AuthController::class, 'resetPassword'])->middleware(['signed'])->name('password.reset.verify');//name added for jobs in SendVerificationLink.php

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
    // Route::apiResource('/application-files',ApplicationFilesController::class);
    Route::post('/application-files/{file_id}',[ApplicationFilesController::class, 'update']);
    Route::post('/approvals/{id}/confirm-submission', [ApprovalController::class, 'confirmDocumentsSubmission']);    
});

Route::get('/download-file/{business_name}/{file_name}', function ($business_name, $file_name) {
    if (!request()->hasValidSignature()) {
        abort(403, 'Unauthorized access');
    }
    // $path = storage_path("app/private/application_files/{$business_name}/{$file_name}");
    // if (!file_exists($path)) {
    //     return response()->json(['message' => 'File not found'], 404);
    // }
    // return response()->file($path, ['Content-Type' => mime_content_type($path)]);
    if (app()->environment('local')) {
        // Local: serve file from storage
        $path = storage_path("app/private/application_files/{$business_name}/{$file_name}");
        if (!file_exists($path)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return response()->file($path, ['Content-Type' => mime_content_type($path)]);
    } else {
        // Production: assume Cloudinary URL is stored in the DB
        $fileRecord = App\Models\ApplicationFiles::where('file_name', $file_name)
            ->whereHas('application', fn ($q) => $q->where('business_name', $business_name))
            ->first();

        if (!$fileRecord || !Illuminate\Support\Str::startsWith($fileRecord->file_path, 'http')) {
            return response()->json(['message' => 'File not found'], 404);
        }

        return redirect()->away($fileRecord->file_path); // Redirect to Cloudinary-hosted file
    }

})->name('download-file');


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
