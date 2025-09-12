// src/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Optional: verify session with backend
      try {
        const response = await fetch(
          'https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/session',
          {
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${token}`, // fallback to token
            },
          }
        );

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // If session invalid, log out
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        // If fetch fails, fallback to token
        setIsAuthenticated(!!token);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
