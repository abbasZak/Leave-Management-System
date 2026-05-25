import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

interface EmployeeStats {
  total_taken: number;
  pending: number;
  approved: number;
  rejected: number;
}

const fetchEmployeeStats = async (): Promise<EmployeeStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const EmployeeDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['employeeStats'],
    queryFn: fetchEmployeeStats,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="text-gray-400 text-sm">Loading your stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-5 bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-600 text-sm">Could not load dashboard data</p>
        <p className="text-gray-500 text-xs mt-1">Try refreshing the page</p>
      </div>
    );
  }

  const totalDays = data?.total_taken ?? 0;
  const pendingReqs = data?.pending ?? 0;
  const approvedReqs = data?.approved ?? 0;
  const rejectedReqs = data?.rejected ?? 0;

  const summaryCards = [
    { 
      name: 'Days taken', 
      value: totalDays,
      unit: totalDays === 1 ? 'day' : 'days',
      color: 'blue'
    },
    { 
      name: 'Pending', 
      value: pendingReqs,
      unit: pendingReqs === 1 ? 'request' : 'requests',
      color: 'yellow'
    },
    { 
      name: 'Approved', 
      value: approvedReqs,
      unit: approvedReqs === 1 ? 'request' : 'requests',
      color: 'green'
    },
    { 
      name: 'Rejected', 
      value: rejectedReqs,
      unit: rejectedReqs === 1 ? 'request' : 'requests',
      color: 'red'
    },
  ];

  const getColorStyles = (color: string) => {
    switch(color) {
      case 'blue':
        return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' };
      case 'yellow':
        return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-100' };
      case 'green':
        return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' };
      case 'red':
        return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100' };
    }
  };

  return (
    <div className="p-5">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">My leave summary</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of your leave activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const styles = getColorStyles(card.color);
          return (
            <div 
              key={idx}
              className={`${styles.bg} border ${styles.border} rounded-md p-4`}
            >
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                {card.name}
              </p>
              <div className="flex items-baseline gap-1 mt-2">
                <span className={`${styles.text} text-2xl font-semibold`}>
                  {card.value}
                </span>
                <span className="text-xs text-gray-400">
                  {card.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};