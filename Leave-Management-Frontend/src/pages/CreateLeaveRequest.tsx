import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axios';

interface LeaveRequestForm {
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
}

export default function CreateLeaveRequest() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LeaveRequestForm>({
    defaultValues: {
      leave_type: 'annual',
      start_date: '',
      end_date: '',
      reason: '',
    },
  });

  const startDate = watch('start_date');

  const onSubmit = async (data: LeaveRequestForm) => {
    setSubmitError(null);
    
    try {
      await api.post('/leave-requests', data);
      navigate('/employee/history');
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="p-5 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-medium text-gray-800">Request time off</h1>
        <p className="text-gray-500 text-sm mt-1">Fill out the form below to submit a leave request</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-md p-5 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Type of leave
            </label>
            <select
              {...register('leave_type', { required: 'Please select a leave type' })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              <option value="annual">Annual leave</option>
              <option value="sick">Sick leave</option>
              <option value="casual">Casual leave</option>
            </select>
            {errors.leave_type && (
              <p className="text-red-500 text-xs mt-1">{errors.leave_type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start date
              </label>
              <input
                type="date"
                {...register('start_date', { required: 'Start date is required' })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              {errors.start_date && (
                <p className="text-red-500 text-xs mt-1">{errors.start_date.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End date
              </label>
              <input
                type="date"
                {...register('end_date', { 
                  required: 'End date is required',
                  validate: (value) => {
                    if (!startDate) return true;
                    return value >= startDate || 'End date must be after start date';
                  }
                })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">{errors.end_date.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason
            </label>
            <textarea
              rows={4}
              {...register('reason', { required: 'Please provide a reason' })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              placeholder="Briefly explain why you need time off..."
            />
            {errors.reason && (
              <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee')}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}