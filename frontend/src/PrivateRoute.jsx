import { Navigate, Outlet, useLocation, useNavigate } from 'react-router';
import AppLayout from './layout/AppLayout';
import useUserStore from './_utils/store/useUserStore';
import { useEffect, useState } from 'react';
import { ApiClient } from './_utils/axios';
import Spinner from './components/spinner/Spinner';
import { useQuery } from "@tanstack/react-query";

const PrivateRoute = () => {
  const navigate = useNavigate();
  const location = useLocation();
const { user, setUser, isSameUser } = useUserStore();


const { data, isSuccess, isError, isFetching } = useQuery({
  queryKey: ["auth-check", location.pathname], // refetches on route change
  queryFn: () =>
    ApiClient.get("/auth/check").then((res) => res.data),
  retry: false, // don't retry on failure
  refetchOnWindowFocus: false, // optional: avoid refetching on tab focus
  staleTime: 0, // always refetch on key change
  onSuccess: ({ success, data }) => {
    if (success) {
      if (data.verified) {
        if (!isSameUser(data)) {
          setUser(data);
        }
      } else {
        navigate("/verify");
      }
    } else {
      navigate("/signin");
    }
  },
  onError: () => {
    navigate("/signin");
  },
});


    if (isFetching) return <Spinner />;


  return user  ? (
    <AppLayout> 
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;