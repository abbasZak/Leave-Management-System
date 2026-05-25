import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';

interface LeaveRequest {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  leave_type: string;
  leave_type_formatted: string;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  admin_comment: string | null;
  created_at: string;
}

const fetchLeaveRequests = async (statusFilter: string, searchTerm: string) => {
  const params: any = {};
  if (statusFilter) params.status = statusFilter;
  if (searchTerm) params.search = searchTerm;
  
  const response = await api.get('/leave-requests', { params });
  return response.data;
};

export default function ManageRequests() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaveRequests', statusFilter, searchTerm],
    queryFn: () => fetchLeaveRequests(statusFilter, searchTerm),
  });

  const approveMutation = useMutation({
    mutationFn: async ({ id, comment }: { id: number; comment?: string }) => {
      const response = await api.put(`/leave-requests/${id}/approve`, { comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      alert('Request approved successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to approve request');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, comment }: { id: number; comment: string }) => {
      const response = await api.put(`/leave-requests/${id}/reject`, { comment });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
      setShowRejectModal(false);
      setRejectComment('');
      setSelectedRequest(null);
      alert('Request rejected successfully');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Failed to reject request');
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">Rejected</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const leaveRequests = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-400">Loading requests...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-5 bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-600 text-sm">Failed to load leave requests</p>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">Manage Leave Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Review and process employee leave requests</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-100 rounded-md p-4 mb-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by employee name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            >
              <option value="">All status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      {leaveRequests.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-md p-8 text-center">
          <p className="text-gray-400 text-sm">No leave requests found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Employee</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Type</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Dates</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Days</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaveRequests.map((request: LeaveRequest) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-800">{request.user.name}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{request.leave_type_formatted}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(request.start_date)} - {formatDate(request.end_date)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{request.days} days</td>
                  <td className="py-3 px-4">{getStatusBadge(request.status)}</td>
                  <td className="py-3 px-4">
                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveMutation.mutate({ id: request.id })}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {request.admin_comment && request.status === 'rejected' && (
                      <span className="text-xs text-gray-400">Rejected with comment</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-md">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Reject Leave Request</h2>
            <p className="text-sm text-gray-600 mb-3">
              Rejecting leave request from <strong>{selectedRequest.user.name}</strong>
            </p>
            <textarea
              rows={4}
              placeholder="Reason for rejection..."
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => rejectMutation.mutate({ id: selectedRequest.id, comment: rejectComment })}
                disabled={!rejectComment.trim()}
                className="flex-1 bg-red-600 text-white py-2 rounded text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setSelectedRequest(null);
                  setRejectComment('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}