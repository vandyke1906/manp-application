import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import BusinessType from './pages/BusinessType/BusinessType';
import Zoning from './pages/Zone/Zoning';
import ZoningForm from './pages/Zone/ZoningForm';
import BusinessTypeForm from './pages/BusinessType/BusinessTypeForm';
import Proponent from './pages/Proponent/Proponent';
import ProponentForm from './pages/Proponent/ProponentForm';
import ApplicationForm from './pages/Application/ApplicationForm';
import Applications from './pages/Application/Applications';
import ApplicationType from './pages/ApplicationType/ApplicationType';
import ApplicationTypeForm from './pages/ApplicationType/ApplicationTypeForm';
import PrivateRoute from './PrivateRoute';
import SignIn from './pages/AuthPages/SignIn';
import SignUp from './pages/AuthPages/SignUp';
import Verification from './pages/AuthPages/Verification';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import ApplicantType from './pages/ApplicantType/ApplicantType';
import ApplicantTypeForm from './pages/ApplicantType/ApplicantTypeForm';
import Capitalization from './pages/Capitalization/Capitalization';
import CapitalizationForm from './pages/Capitalization/CapitalizationForm';
import BusinessNature from './pages/BusinessNature/BusinessNature';
import BusinessNatureForm from './pages/BusinessNature/BusinessNatureForm';
import BusinessStatus from './pages/BusinessStatus/BusinessStatus';
import BusinessStatusForm from './pages/BusinessStatus/BusinessStatusForm';
import ApplicationView from './pages/Application/ApplicationView';
import { ROLES } from './_utils/helper';
import ProtectedComponent from './pages/ProtectedComponent';
import useUserStore from './_utils/store/useUserStore';

function App() {
  const { user } = useUserStore();
  return (
    <>
    <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<PrivateRoute />}>
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="/application-form" element={<ApplicationForm />} />
            <Route path="/application-form/:id" element={<ApplicationForm />} />
            {/* <Route path="/application-view/:id" element={<ApplicationView />} /> */}
            <Route path="/application-view/:id" element={
              <ProtectedComponent user={user} allowedRoles={[ROLES.RPS_TEAM, ROLES.MANAGER, ROLES.ADMINISTRATOR]}>
                <ApplicationView />
              </ProtectedComponent>
            } />


            <Route path="/proponent">
              <Route index element={<Proponent />} /> {/* Default route */}
              <Route path="create" element={<ProponentForm />} />
              <Route path="update/:id" element={<ProponentForm />} />
            </Route>

            <Route path="/application-type">
              <Route index element={<ApplicationType />} /> {/* Default route */}
              <Route path="create" element={<ApplicationTypeForm />} />
              <Route path="update/:id" element={<ApplicationTypeForm />} />
            </Route>
            
            <Route path="/business-type">
              <Route index element={<BusinessType />} /> {/* Default route */}
              <Route path="create" element={<BusinessTypeForm />} />
              <Route path="update/:id" element={<BusinessTypeForm />} />
            </Route>
            
            <Route path="/zoning">
              <Route index element={<Zoning />} /> {/* Default route */}
              <Route path="create" element={<ZoningForm />} />
              <Route path="update/:id" element={<ZoningForm />} />
            </Route>

            <Route path="/applicant-type">
              <Route index element={<ApplicantType />} /> {/* Default route */}
              <Route path="create" element={<ApplicantTypeForm />} />
              <Route path="update/:id" element={<ApplicantTypeForm />} />
            </Route>

            <Route path="/capitalization">
              <Route index element={<Capitalization />} /> {/* Default route */}
              <Route path="create" element={<CapitalizationForm />} />
              <Route path="update/:id" element={<CapitalizationForm />} />
            </Route>

            <Route path="/business-nature">
              <Route index element={<BusinessNature />} /> {/* Default route */}
              <Route path="create" element={<BusinessNatureForm />} />
              <Route path="update/:id" element={<BusinessNatureForm />} />
            </Route>

            <Route path="/business-status">
              <Route index element={<BusinessStatus />} /> {/* Default route */}
              <Route path="create" element={<BusinessStatusForm />} />
              <Route path="update/:id" element={<BusinessStatusForm />} />
            </Route>
          </Route>

          
          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify" element={<Verification />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
