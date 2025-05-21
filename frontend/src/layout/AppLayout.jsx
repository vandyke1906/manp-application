import React, { useEffect } from 'react'
import { Outlet, useNavigate } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar"
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import { ToastContainer } from 'react-toastify';
import useUserStore from '../_utils/store/useUserStore';

const CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { user, setUser, clearUser } = useUserStore();
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      const token = userData?.data?.token;

      if (!token) {
        clearUser();
        navigate("/signin");
        return;
      }

      const response = await ApiClient.get('/api/auth-check', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.authenticated) {
        clearUser();
        navigate("/signin");
      } else {
        setUser(userData); // Persist authenticated user
      }
    } catch (error) {
      clearUser();
      navigate("/signin");
    }
  };


  // ✅ Periodic authentication check
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuthStatus();
    }, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen xl:flex">
      <ToastContainer style={{ zIndex: 200000 }} autoClose={3000} />
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"} ${isMobileOpen ? "ml-0" : ""}`}>
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const AppLayout = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    )
}

export default AppLayout