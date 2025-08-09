import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '@/hooks/useUserAuth';
import { Loader2 } from 'lucide-react';

interface UserProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'freelancer' | 'client';
}

export const UserProtectedRoute: React.FC<UserProtectedRouteProps> = ({ 
  children, 
  requiredUserType 
}) => {
  const { isAuthenticated, userType, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on current path
    const loginPath = location.pathname.includes('/freelancer') 
      ? '/freelancer/login' 
      : '/client/login';
    
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check if user type matches required type
  if (requiredUserType && userType !== requiredUserType) {
    // Redirect to appropriate dashboard based on user type
    const redirectPath = userType === 'freelancer' ? '/freelancer' : '/client';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
