import { Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ProtectedRoute = () => {
  const [authState, setAuthState] = useState('checking'); // 'checking', 'authenticated', 'unauthenticated'

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      setAuthState('unauthenticated');
      return;
    }

    // Optimistically set as authenticated
    setAuthState('authenticated');

    // Optional: background token validation
    fetch('https://backend-motafokeen-ajrd.onrender.com/dashboard/auth/session', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    })
      .then(res => {
        if (!res.ok) {
          // Token invalid -> log out
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuthState('unauthenticated');
        }
      })
      .catch(err => {
        console.error('Token validation failed:', err);
        // Keep user logged in temporarily
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
