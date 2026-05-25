import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { Login } from '../pages/Login';
import { EmployeeDashboard } from '../pages/EmployeeDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import CreateLeaveRequest from '../pages/CreateLeaveRequest';
import LeaveHistory from '../pages/LeaveHistory';
import MainLayout from '../layouts/MainLayout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

// Create React Query client
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement; allowedRoles: string[] }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
    
    return children;
};

export const AppRoutes = () => {
    const { user } = useAuth();

    return (
        <QueryClientProvider client={queryClient}>
            
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route element={<MainLayout />}>
                        {/* Employee Routes */}
                        <Route path="/employee" element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <EmployeeDashboard />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/employee/create" element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <CreateLeaveRequest />
                            </ProtectedRoute>
                        } />
                        
                        <Route path="/employee/history" element={
                            <ProtectedRoute allowedRoles={['employee']}>
                                <LeaveHistory />
                            </ProtectedRoute>
                        } />
                        
                        {/* Admin Routes */}
                        <Route path="/admin" element={
                            <ProtectedRoute allowedRoles={['manager']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />
                    </Route>
                    
                    {/* Default redirect */}
                    <Route path="/" element={
                        <Navigate to={user?.role === 'manager' ? '/admin' : '/employee'} />
                    } />
                </Routes>
            
        </QueryClientProvider>
    );
};