import { useState, useEffect } from "react";
import { Plus, Search, Loader2, MapPin, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getLocations, addLocation, updateLocation, deleteLocation } from "../../lib/supabase";
import { Location } from "../../types";
import LocationCard from "../../components/admin/LocationCard";
import LocationForm from "../../components/admin/LocationForm";
import toast from "react-hot-toast";

export default function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const data = await getLocations();
      setLocations(data || []);
    } catch (error: any) {
      toast.error("Failed to load locations: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      await addLocation(data);
      toast.success("Location created successfully");
      fetchLocations();
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingLocation) return;
    try {
      await updateLocation(editingLocation.id, data);
      toast.success("Location updated successfully");
      fetchLocations();
    } catch (error: any) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This will delete the location and all its photos.")) return;
    
    try {
      toast.loading("Deleting location...", { id: "delete-location" });
      await deleteLocation(id);
      setLocations(locations.filter(l => l.id !== id));
      toast.success("Location deleted", { id: "delete-location" });
    } catch (error: any) {
      toast.error("Delete failed: " + error.message, { id: "delete-location" });
    }
  };

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">
            Cafe <span className="text-[#d4af37] italic">Spaces</span>
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-bold">
            Manage your physical locations & galleries
          </p>
        </div>
        
        <button
          onClick={() => {
            setEditingLocation(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all shadow-lg shadow-[#d4af37]/20 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add New Location
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center p-6 bg-[#1a1a1a]/50 backdrop-blur-md border border-[#3a3a3a] rounded-[2rem]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
          />
        </div>
        
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 px-4">
          <MapPin size={16} className="text-[#d4af37]" />
          <span>{filteredLocations.length} Matching Spaces</span>
        </div>
        
        <button 
          onClick={fetchLocations}
          className="p-3 text-gray-500 hover:text-[#d4af37] transition-colors"
          title="Refresh"
        >
          <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Grid Content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-500">
              <Loader2 className="animate-spin text-[#d4af37]" size={48} />
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold">Synchronizing with Cloud</p>
            </div>
          ) : filteredLocations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLocations.map((loc) => (
                <LocationCard
                  key={loc.id}
                  location={loc}
                  onEdit={(l) => {
                    setEditingLocation(l);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-[#3a3a3a] rounded-[3rem] bg-[#1a1a1a]/20">
              <div className="p-6 bg-[#1a1a1a] rounded-full text-gray-700 mb-6">
                <MapPin size={64} strokeWidth={1} />
              </div>
              <h3 className="text-2xl font-serif text-gray-400 mb-2">No locations found</h3>
              <p className="text-gray-600 max-w-sm font-light">
                {searchQuery ? "Try adjusting your search terms or filters." : "Start by adding your first café location to the system."}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="mt-6 text-[#d4af37] font-bold uppercase tracking-widest text-[10px] hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <LocationForm
            location={editingLocation}
            onClose={() => setIsFormOpen(false)}
            onSubmit={editingLocation ? handleUpdate : handleCreate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
