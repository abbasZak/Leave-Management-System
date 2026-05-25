<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeaveRequestController;

// Public Routes (no auth needed)
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes (Need Auth)
Route::middleware('auth:sanctum')->group(function() {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Dashboard stats
    Route::get('/dashboard/stats', [LeaveRequestController::class, 'dashboard']);
    
    // Leave request CRUD routes
    Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
    Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
    Route::put('/leave-requests/{id}', [LeaveRequestController::class, 'update']);
    Route::delete('/leave-requests/{id}', [LeaveRequestController::class, 'destroy']);
    
    // Admin only routes
    Route::put('/leave-requests/{id}/approve', [LeaveRequestController::class, 'approve']);
    Route::put('/leave-requests/{id}/reject', [LeaveRequestController::class, 'reject']);
    
    // Admin dashboard stats
    Route::get('/admin/dashboard-stats', [LeaveRequestController::class, 'adminDashboard']);
});