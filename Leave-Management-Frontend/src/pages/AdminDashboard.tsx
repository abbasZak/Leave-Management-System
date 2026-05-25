import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

interface DashboardStats {
  total_employees: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
};

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-6 mt-6 bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-600 text-sm">Something went wrong loading the dashboard</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm text-red-500 mt-2 hover:text-red-700"
        >
          Try again
        </button>
      </div>
    );
  }

  const totalEmployees = data?.total_employees ?? 0;
  const pendingRequests = data?.pending_requests ?? 0;
  const approvedRequests = data?.approved_requests ?? 0;
  const rejectedRequests = data?.rejected_requests ?? 0;

  const stats = [
    {
      label: 'Total employees',
      value: totalEmployees,
      change: '+5%',
      color: 'blue'
    },
    {
      label: 'Pending approvals',
      value: pendingRequests,
      change: pendingRequests > 10 ? '+2' : '0',
      color: 'yellow'
    },
    {
      label: 'Approved leaves',
      value: approvedRequests,
      change: '+12',
      color: 'green'
    },
    {
      label: 'Rejected leaves',
      value: rejectedRequests,
      change: '-3',
      color: 'red'
    },
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'blue':
        return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'hover:border-blue-200' };
      case 'yellow':
        return { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'hover:border-yellow-200' };
      case 'green':
        return { bg: 'bg-green-50', text: 'text-green-600', border: 'hover:border-green-200' };
      case 'red':
        return { bg: 'bg-red-50', text: 'text-red-600', border: 'hover:border-red-200' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-600', border: 'hover:border-gray-200' };
    }
  };

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of leave activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const colors = getColorClasses(stat.color);
          return (
            <div 
              key={idx}
              className={`bg-white border border-gray-100 rounded-lg p-5 shadow-sm transition-all duration-200 ${colors.border}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-400 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-semibold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
                  <svg className={`w-4 h-4 ${colors.text}`} fill="currentColor" viewBox="0 0 20 20">
                    {stat.color === 'blue' && (
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    )}
                    {stat.color === 'yellow' && (
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    )}
                    {(stat.color === 'green' || stat.color === 'red') && (
                      <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
                    )}
                  </svg>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {stat.change !== '0' ? stat.change : 'No change'}
                </span>
                <span className="text-xs text-gray-400">from last month</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}