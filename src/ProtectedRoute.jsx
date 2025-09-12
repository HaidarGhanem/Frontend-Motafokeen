// src/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          'https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/session',
          {
            credentials: 'include', // Important: send cookies
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Optionally store user data in localStorage
          if (data.user) localStorage.setItem('user', JSON.stringify(data.user));
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    };

    checkSession();
  }, []); // Run only on mount, not dependent on token

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
