import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Layers, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  Coffee,
  ChevronRight,
  BookOpen,
  Plus,
  ImageIcon,
  Upload,
  MapPin,
  MessageSquare,
  Compass
} from "lucide-react";
import { supabase, getMenuItems, getCategories, getGalleryItems, getLocations, getTestimonials } from "../../lib/supabase";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [stats, setStats] = useState({ items: 0, categories: 0, gallery: 0, locations: 0, testimonials: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
      }
    };
    getUser();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [items, categories, gallery, locations, testimonials] = await Promise.all([
        getMenuItems(),
        getCategories(),
        getGalleryItems(),
        getLocations(),
        getTestimonials()
      ]);
      setStats({
        items: items.length,
        categories: categories.length,
        gallery: gallery.length,
        locations: locations.length,
        testimonials: testimonials.length
      });
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { label: "Website Home", icon: LayoutDashboard, path: "/admin/home" },
    { label: "Our Story", icon: BookOpen, path: "/admin/our-story" },
    { label: "Get To Know Us", icon: BookOpen, path: "/admin/get-to-know-us" },
    { label: "Menu Items", icon: UtensilsCrossed, path: "/admin/menu" },
    { label: "Categories", icon: Layers, path: "/admin/categories" },
    { label: "Gallery", icon: ImageIcon, path: "/admin/gallery" },
    { label: "Locations", icon: MapPin, path: "/admin/locations" },
    { label: "Testimonials", icon: MessageSquare, path: "/admin/testimonials" },
    { label: "Navigation Settings", icon: Compass, path: "/admin/navigation" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#1a1a1a] border-r border-[#3a3a3a] transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#d4af37] rounded-xl flex items-center justify-center shadow-lg shadow-[#d4af37]/20">
              <Coffee className="text-black" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">IZ CMS</h1>
              <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest">Premium Admin</p>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? "bg-[#d4af37] text-black font-bold shadow-lg shadow-[#d4af37]/20" 
                      : "text-gray-400 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-black" : "group-hover:text-[#d4af37] transition-colors"} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-[#3a3a3a]">
            <div className="flex items-center gap-3 px-4 py-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#3a3a3a] flex items-center justify-center text-[#d4af37] font-bold">
                {userEmail?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{userEmail}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
            >
              <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-[#3a3a3a] bg-[#1a1a1a]/50 backdrop-blur-md flex items-center px-6 lg:px-10 sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`lg:hidden p-2 hover:bg-[#2a2a2a] rounded-lg transition-colors mr-4 ${isSidebarOpen ? 'hidden' : 'block'}`}
          >
            <MenuIcon size={24} />
          </button>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-400">
              {navItems.find(item => item.path === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-full text-sm text-gray-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              System Online
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          <Outlet />
          
          {/* Default Dashboard Content if no child route */}
          {location.pathname === "/admin/dashboard" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "Menu Items", value: stats.items, icon: UtensilsCrossed, color: "blue" },
                  { label: "Categories", value: stats.categories, icon: Layers, color: "purple" },
                  { label: "Gallery Media", value: stats.gallery, icon: ImageIcon, color: "green" },
                  { label: "Locations", value: stats.locations, icon: MapPin, color: "gold" },
                  { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "blue" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-[#1a1a1a] border border-[#3a3a3a] p-6 rounded-2xl hover:border-[#d4af37]/30 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-[#2a2a2a] text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all`}>
                        <stat.icon size={24} />
                      </div>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium">{stat.label}</h3>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link 
                    to="/admin/menu" 
                    className="flex items-center gap-4 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl hover:border-[#d4af37] transition-all group"
                  >
                    <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                      <Plus size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Add Menu</h4>
                      <p className="text-[10px] text-gray-500">New product</p>
                    </div>
                  </Link>
                  <Link 
                    to="/admin/categories" 
                    className="flex items-center gap-4 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl hover:border-[#d4af37] transition-all group"
                  >
                    <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Categories</h4>
                      <p className="text-[10px] text-gray-500">Organize menu</p>
                    </div>
                  </Link>
                  <Link 
                    to="/admin/gallery" 
                    className="flex items-center gap-4 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl hover:border-[#d4af37] transition-all group"
                  >
                    <div className="p-3 bg-[#d4af37]/10 rounded-lg text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-all">
                      <Upload size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold">Gallery</h4>
                      <p className="text-[10px] text-gray-500">Upload media</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
