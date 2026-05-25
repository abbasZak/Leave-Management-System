<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LeaveRequestStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'leave_type' => 'required|in:annual,sick,casual',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'required|string|min:10|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'end_date.after_or_equal' => 'End date must be after or equal to start date',
            'reason.min' => 'Please provide a more detailed reason (minimum 10 characters)',
            'reason.required' => 'Please provide a reason for your leave request',
            'leave_type.required' => 'Please select a leave type',
            'start_date.required' => 'Please select a start date',
            'end_date.required' => 'Please select an end date',
        ];
    }
}