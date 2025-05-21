import { Navigate, Outlet } from 'react-router';
import AppLayout from './layout/AppLayout';
import useUserStore from './_utils/store/useUserStore';

const PrivateRoute = () => {
  const { user } = useUserStore();

  return user  ? (
    <AppLayout> 
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;