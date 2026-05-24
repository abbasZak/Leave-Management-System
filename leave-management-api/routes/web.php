<?php

use Illuminate\Support\Facades\Route;
use App\Controllers\Api\AuthController;
use App\Controllers\Api\LeaveRequestController;

Route::get('/', function () {
    return view('welcome');
});

// Public Routes (no auth needed)
Route::post('/login' , [AuthController::class, 'login']);

// Protected Routes (Need Auth)
Route::middleware('auth-sanctum')->group(function() {
    Route::post('/logout' , [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [LeaveRequestController::class, 'dashboard']);
});
