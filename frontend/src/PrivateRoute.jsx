import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import AppLayout from './layout/AppLayout';
import useUserStore from './_utils/store/useUserStore';
import { useEffect, useState } from 'react';
import { ApiClient } from './_utils/axios';
import Spinner from './components/spinner/Spinner';

const PrivateRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { user, setUser, isSameUser } = useUserStore();
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    ApiClient.get("/auth/check").then((response) => {
        const { success, data } = response.data;
        if(success){
          if(data.verified){
            if(!isSameUser(data)){
              setUser(data);
            }
          } else {
             navigate("/verify");
          }
        } else {
          navigate("/signin");
        }
      }).finally(() => setLoading(false));
  }, [location.pathname]);

    if (loading) {
      return <Spinner />; // Show a loading state while verifying authentication
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