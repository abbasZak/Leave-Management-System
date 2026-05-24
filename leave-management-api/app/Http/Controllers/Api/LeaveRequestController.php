// app/Http/Controllers/Api/LeaveRequestController.php
<?php

namespace App\Http\Controllers\Api;

use App\Models\LeaveRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\LeaveRequestStoreRequest;
use App\Http\Resources\LeaveRequestResource;
use Illuminate\Http\Request;

class LeaveRequestController extends Controller
{
    // GET /leave-requests
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = LeaveRequest::with('user');
        
        // If employee, only see their requests
        if ($user->isEmployee()) {
            $query->where('user_id', $user->id);
        }
        
        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('leave_type')) {
            $query->where('leave_type', $request->leave_type);
        }
        
        // Search by employee name (admin only)
        if ($request->has('search') && $user->isManager()) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }
        
        $leaveRequests = $query->latest()->paginate(10);
        
        return LeaveRequestResource::collection($leaveRequests);
    }

    // POST /leave-requests
    public function store(LeaveRequestStoreRequest $request)
    {
        $leaveRequest = LeaveRequest::create([
            'user_id' => $request->user()->id,
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);
        
        return new LeaveRequestResource($leaveRequest);
    }

    // PUT /leave-requests/{id}
    public function update(LeaveRequestStoreRequest $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        
        // Authorization: Only owner can edit, and only if pending
        if ($leaveRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($leaveRequest->status !== 'pending') {
            return response()->json(['message' => 'Can only edit pending requests'], 422);
        }
        
        $leaveRequest->update([
            'leave_type' => $request->leave_type,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'reason' => $request->reason,
        ]);
        
        return new LeaveRequestResource($leaveRequest);
    }

    // DELETE /leave-requests/{id}
    public function destroy(Request $request, $id)
    {
        $leaveRequest = LeaveRequest::findOrFail($id);
        
        // Only owner can cancel, and only if pending
        if ($leaveRequest->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        if ($leaveRequest->status !== 'pending') {
            return response()->json(['message' => 'Can only cancel pending requests'], 422);
        }
        
        $leaveRequest->delete();
        
        return response()->json(['message' => 'Request cancelled']);
    }

    // PUT /leave-requests/{id}/approve
    public function approve(Request $request, $id)
    {
        // Only managers can approve
        if (!$request->user()->isManager()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->update([
            'status' => 'approved',
            'admin_comment' => $request->comment
        ]);
        
        return new LeaveRequestResource($leaveRequest);
    }

    // PUT /leave-requests/{id}/reject
    public function reject(Request $request, $id)
    {
        // Only managers can reject
        if (!$request->user()->isManager()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'comment' => 'required|string|min:5'
        ]);
        
        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->update([
            'status' => 'rejected',
            'admin_comment' => $request->comment
        ]);
        
        return new LeaveRequestResource($leaveRequest);
    }

    // Add to LeaveRequestController.php
public function dashboard(Request $request)
    {
        $user = $request->user();
        
        if ($user->isEmployee()) {
            // Employee dashboard stats
            $stats = [
                'total_taken' => LeaveRequest::where('user_id', $user->id)
                    ->where('status', 'approved')
                    ->sum('days'),
                'pending' => LeaveRequest::where('user_id', $user->id)
                    ->where('status', 'pending')->count(),
                'approved' => LeaveRequest::where('user_id', $user->id)
                    ->where('status', 'approved')->count(),
                'rejected' => LeaveRequest::where('user_id', $user->id)
                    ->where('status', 'rejected')->count(),
            ];
        } else {
            // Manager dashboard stats
            $stats = [
                'total_employees' => User::where('role', 'employee')->count(),
                'pending_approvals' => LeaveRequest::where('status', 'pending')->count(),
                'approved_leaves' => LeaveRequest::where('status', 'approved')->count(),
                'rejected_leaves' => LeaveRequest::where('status', 'rejected')->count(),
            ];
        }
        
        return response()->json($stats);
    }
}