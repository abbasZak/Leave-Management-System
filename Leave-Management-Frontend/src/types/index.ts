export interface User {
    id: number;
    name: string;
    email: string;
    role: 'employee' | 'manager';
}

export interface LeaveRequest {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    leave_type: 'annual' | 'sick' | 'casual';
    leave_type_formatted: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_comment: string | null;
    created_at: string;
}

export interface EmployeeStats {
    total_taken: number;
    pending: number;
    approved: number;
    rejected: number;
}

export interface AdminStats {
    total_employees: number;
    pending_approvals: number;
    approved_leaves: number;
    rejected_leaves: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LeaveRequestFormData {
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
}