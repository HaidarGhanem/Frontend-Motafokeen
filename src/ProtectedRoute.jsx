import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuthChecked(true);
      setIsAuthenticated(false);
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch(
          'https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/session',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) setIsAuthenticated(true);
        else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true); // Important: mark check as finished
      }
    };

    checkToken();
  }, []);

  // Show a loading screen **until auth is checked**
  if (!authChecked) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
