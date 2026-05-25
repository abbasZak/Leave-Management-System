import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/axios';

interface LeaveRequest {
  id: number;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
  reason?: string;
}

const fetchLeaveRequests = async (statusFilter: string) => {
  const params = statusFilter ? { status: statusFilter } : {};
  const response = await api.get('/leave-requests', { params });
  return response.data;
};

export default function LeaveHistory() {
  const [statusFilter, setStatusFilter] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['leaveRequests', statusFilter],
    queryFn: () => fetchLeaveRequests(statusFilter),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'rejected':
        return '❌';
      default:
        return '⏳';
    }
  };

  const formatLeaveType = (type: string) => {
    const types: Record<string, string> = {
      annual: '🏖️ Annual Leave',
      sick: '🤒 Sick Leave',
      casual: '🎉 Casual Leave',
    };
    return types[type] || type;
  };

  const leaveRequests = data?.data || data || [];

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Leave History</h1>
            <p className="text-gray-600 mt-1">View all your leave requests</p>
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading leave requests...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <p className="text-red-600">Failed to load leave history</p>
        </div>
      )}

      {!isLoading && !error && leaveRequests.length === 0 && (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No leave requests found</p>
          <p className="text-gray-400 text-sm mt-1">Create your first leave request to get started</p>
        </div>
      )}

      {!isLoading && !error && leaveRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaveRequests.map((request: LeaveRequest) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatLeaveType(request.leave_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(request.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(request.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                        <span>{getStatusIcon(request.status)}</span>
                        <span>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}