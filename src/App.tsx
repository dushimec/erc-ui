import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import AboutUs from "./pages/AboutUs";
import Events from "./pages/Event";
import Donate from "./pages/Donate";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import Footer from './components/Footer'
import Header from './components/Header'
import Services from './pages/Services'
import ContactPage from './pages/ContactPage'
import DashboardLayout from './components/DashboardLayout'
import Overview from './pages/dashboard/Overview'
import UsersPage from './pages/dashboard/UsersPage'
import MembersPage from './pages/dashboard/MembersPage'
import PastoralPage from './pages/dashboard/PastoralPage'
import FinancePage from './pages/dashboard/FinancePage'
import SermonsPage from './pages/dashboard/SermonsPage'
import ServicesPage from './pages/dashboard/ServicesPage'
import CommunityPage from './pages/dashboard/CommunityPage'
import CommunicationPage from './pages/dashboard/CommunicationPage'
import MediaPage from './pages/dashboard/MediaPage'
import FormsPage from './pages/dashboard/FormsPage'
import AboutManagement from './pages/dashboard/AboutManagement'
import ContactManagement from './pages/dashboard/ContactManagement'
import ProfilePage from './pages/dashboard/ProfilePage'
import Login from './pages/Login'


import { SearchProvider } from './context/SearchContext'

function App() {
  return (
    <SearchProvider>
      <div>
        <Routes>
          {/* Main Website Routes */}
          <Route path='/' element={<><Header /><Home /><Footer /></>} />
          <Route path="/login" element={<Login />} />
          <Route path="/aboutus" element={<><Header /><AboutUs /><Footer /></>} />
          <Route path="/about" element={<><Header /><AboutUs /><Footer /></>} />
          <Route path="/events" element={<><Header /><Events /><Footer /></>} />
          <Route path="/donate" element={<><Header /><Donate /><Footer /></>} />
          <Route path='/services' element={<><Header /><Services /><Footer /></>} />
          <Route path='/contact' element={<><Header /><ContactPage /><Footer /></>} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout><Overview /></DashboardLayout>} />
          <Route path="/dashboard/users" element={<DashboardLayout><UsersPage /></DashboardLayout>} />
          <Route path="/dashboard/members" element={<DashboardLayout><MembersPage /></DashboardLayout>} />
          <Route path="/dashboard/pastoral" element={<DashboardLayout><PastoralPage /></DashboardLayout>} />
          <Route path="/dashboard/finance" element={<DashboardLayout><FinancePage /></DashboardLayout>} />
          <Route path="/dashboard/sermons" element={<DashboardLayout><SermonsPage /></DashboardLayout>} />
          <Route path="/dashboard/services" element={<DashboardLayout><ServicesPage /></DashboardLayout>} />
          <Route path="/dashboard/community" element={<DashboardLayout><CommunityPage /></DashboardLayout>} />
          <Route path="/dashboard/notifications" element={<DashboardLayout><CommunicationPage /></DashboardLayout>} />
          <Route path="/dashboard/media" element={<DashboardLayout><MediaPage /></DashboardLayout>} />
          <Route path="/dashboard/forms" element={<DashboardLayout><FormsPage /></DashboardLayout>} />
          <Route path="/dashboard/profile" element={<DashboardLayout><ProfilePage /></DashboardLayout>} />
          <Route path="/dashboard/about-mgmt" element={<DashboardLayout><AboutManagement /></DashboardLayout>} />

          <Route path="/dashboard/contact-mgmt" element={<DashboardLayout><ContactManagement /></DashboardLayout>} />
        </Routes>
        <ToastContainer position="top-right" theme="light" pauseOnHover autoClose={4000} />
      </div>
    </SearchProvider>
  )
}


export default App
