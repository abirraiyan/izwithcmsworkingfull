import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import OurStory from "./pages/OurStory";
import GetToKnowUs from "./pages/GetToKnowUs";
import Locations from "./pages/Locations";
import LocationDetails from "./pages/LocationDetails";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import MenuManager from "./pages/admin/MenuManager";
import CategoryManager from "./pages/admin/CategoryManager";
import GalleryManager from "./pages/admin/GalleryManager";
import AdminLocations from "./pages/admin/AdminLocations";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminHome from "./pages/admin/home";
import AdminOurStory from "./pages/admin/our-story";
import AdminGetToKnowUs from "./pages/admin/get-to-know-us";
import NavigationManager from "./pages/admin/NavigationManager";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!isAdminRoute && <Navbar />}
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/get-to-know-us" element={<GetToKnowUs />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/locations/:slug" element={<LocationDetails />} />
          <Route path="/contact" element={<Contact />} />
          
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={null} /> {/* Handled by AdminDashboard default content */}
            <Route path="home" element={<AdminHome />} />
            <Route path="our-story" element={<AdminOurStory />} />
            <Route path="get-to-know-us" element={<AdminGetToKnowUs />} />
            <Route path="menu" element={<MenuManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="locations" element={<AdminLocations />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="navigation" element={<NavigationManager />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!isAdminRoute && <Footer />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px border #3a3a3a',
          },
        }}
      />
      <div className="relative bg-cream min-h-screen font-sans">
        <div className="bg-noise" />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
