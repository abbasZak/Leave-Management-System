<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LeaveRequestResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ],
            'leave_type' => $this->leave_type,
            'leave_type_formatted' => ucfirst($this->leave_type),
            'start_date' => $this->start_date->format('Y-m-d'),
            'end_date' => $this->end_date->format('Y-m-d'),
            'days' => $this->days,
            'reason' => $this->reason,
            'status' => $this->status,
            'admin_comment' => $this->admin_comment,
            'created_at' => $this->created_at->diffForHumans(),
        ];
    }
}