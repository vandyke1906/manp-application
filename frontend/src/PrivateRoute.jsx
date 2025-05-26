import { Navigate, Outlet, useLocation } from 'react-router';
import AppLayout from './layout/AppLayout';
import useUserStore from './_utils/store/useUserStore';
import { useEffect, useState } from 'react';
import { ApiClient } from './_utils/axios';

const PrivateRoute = () => {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
    const location = useLocation(); // Detect route changes


  useEffect(() => {
    ApiClient.get("/auth-check").then((response) => {
        console.log(response.data);
      }).catch(() => setUser(null)).finally(() => setLoading(false));
  }, [location.pathname]);

    if (loading) {
      return <div>Loading...</div>; // Show a loading state while verifying authentication
    }


  return user  ? (
    <AppLayout> 
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;