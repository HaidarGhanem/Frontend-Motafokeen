import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        setAuthState('unauthenticated');
        return;
      }

      try {
        const res = await fetch(
          'https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/session',
          {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );

        if (res.ok) {
          setAuthState('authenticated');
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState('unauthenticated');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setAuthState('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  if (authState === 'checking') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;