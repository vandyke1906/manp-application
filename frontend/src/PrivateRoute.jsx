import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router';
import AppLayout from './layout/AppLayout';
import { ApiClient } from './_utils/axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await ApiClient.get('/auth-check');
        console.log({data: response?.data});
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.log({error});
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  return isAuthenticated;
};

const PrivateRoute = () => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking authentication
  }

  return isAuthenticated ? (
    <AppLayout> 
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;