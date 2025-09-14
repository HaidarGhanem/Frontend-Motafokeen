import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !user) {
      setAuthState('unauthenticated');
      return;
    }

    // Check token expiry
    if (tokenExpiry && Date.now() > parseInt(tokenExpiry)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');
      setAuthState('unauthenticated');
      return;
    }

    // Token exists and not expired → consider authenticated
    setAuthState('authenticated');

    // Optional: validate token in background
    fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/session', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).then(res => {
      if (!res.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
        setAuthState('unauthenticated');
      }
    }).catch(err => {
      console.error('Token validation failed:', err);
    });

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
