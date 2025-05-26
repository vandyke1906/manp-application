import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import BusinessType from './pages/BusinessType/BusinessType';
import Zoning from './pages/Zone/Zoning';
import NotFound from './pages/NotFound';
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

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<PrivateRoute />}>
            <Route index path="/" element={<Home />} />
            <Route index path="/profile" element={<UserProfile />} />
            <Route index path="/applications" element={<Applications />} />
            <Route index path="/application-form" element={<ApplicationForm />} />

            <Route path="/proponent">
              <Route index element={<Proponent />} /> {/* Default route */}
              <Route path="create" element={<ProponentForm />} />
              <Route path="update/:id" element={<ProponentForm />} /> {/* Dynamic route */}
            </Route>

            <Route path="/application-type">
              <Route index element={<ApplicationType />} /> {/* Default route */}
              <Route path="create" element={<ApplicationTypeForm />} />
              <Route path="update/:id" element={<ApplicationTypeForm />} /> {/* Dynamic route */}
            </Route>
            
            <Route path="/business-type">
              <Route index element={<BusinessType />} /> {/* Default route */}
              <Route path="create" element={<BusinessTypeForm />} />
              <Route path="update/:id" element={<BusinessTypeForm />} /> {/* Dynamic route */}
            </Route>
            
            <Route path="/zoning">
              <Route index element={<Zoning />} /> {/* Default route */}
              <Route path="create" element={<ZoningForm />} />
              <Route path="update/:id" element={<ZoningForm />} /> {/* Dynamic route */}
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
