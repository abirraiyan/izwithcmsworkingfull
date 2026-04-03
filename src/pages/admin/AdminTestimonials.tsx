import { useState, useEffect, FormEvent } from "react";
import { 
  Plus, 
  Search, 
  Loader2, 
  MessageSquare, 
  Star, 
  Trash2, 
  Edit, 
  X, 
  Save, 
  Quote 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from "../../lib/supabase";
import { Testimonial } from "../../types";
import toast from "react-hot-toast";

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    content: "",
    is_featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data || []);
    } catch (error: any) {
      toast.error("Error loading testimonials: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        role: item.role,
        content: item.content,
        is_featured: item.is_featured
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        role: "",
        content: "",
        is_featured: false
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateTestimonial(editingItem.id, formData);
        toast.success("Testimonial updated");
      } else {
        await addTestimonial(formData);
        toast.success("Testimonial added");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error("Error saving: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      toast.success("Testimonial deleted");
      fetchData();
    } catch (error: any) {
      toast.error("Error deleting: " + error.message);
    }
  };

  const toggleFeatured = async (item: Testimonial) => {
    try {
      await updateTestimonial(item.id, { is_featured: !item.is_featured });
      toast.success(item.is_featured ? "Removed from featured" : "Set as featured");
      fetchData();
    } catch (error: any) {
      toast.error("Error updating featured status: " + error.message);
    }
  };

  const filteredItems = testimonials.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">
            Guest <span className="text-[#d4af37] italic">Testimonials</span>
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-[0.2em] font-bold">
            Manage reviews and community feedback
          </p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all shadow-lg shadow-[#d4af37]/20 group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Testimonial
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center p-6 bg-[#1a1a1a]/50 backdrop-blur-md border border-[#3a3a3a] rounded-[2rem]">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
          />
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-gray-500 px-4">
          {filteredItems.length} Records Found
        </div>
      </div>

      {/* Grid */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-gray-500">
            <Loader2 className="animate-spin text-[#d4af37]" size={48} />
            <p className="uppercase tracking-[0.3em] text-[10px] font-bold">Fetching Feedback</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-[#1a1a1a]/50 backdrop-blur-md border border-[#3a3a3a] p-8 rounded-[2rem] flex flex-col hover:border-[#d4af37]/30 transition-all group relative overflow-hidden"
                >
                  <Quote className="absolute -top-4 -right-4 w-24 h-24 text-white/5 group-hover:text-gold/10 transition-colors" />
                  
                  <div className="mb-6 flex-1">
                    <p className="text-gray-300 italic font-light leading-relaxed line-clamp-4">
                      "{item.content}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-[#3a3a3a]">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#d4af37]">{item.name}</h3>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{item.role}</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button
                        onClick={() => toggleFeatured(item)}
                        className={`p-2 rounded-full transition-all ${
                          item.is_featured 
                            ? "bg-gold text-black shadow-lg shadow-gold/20" 
                            : "bg-[#2a2a2a] text-gray-500 hover:text-gold"
                        }`}
                        title={item.is_featured ? "Remove from Featured" : "Pin to Homepage"}
                      >
                        <Star size={16} fill={item.is_featured ? "currentColor" : "none"} />
                      </button>
                      <button
                        onClick={() => handleOpenModal(item)}
                        className="p-2 bg-[#2a2a2a] text-gray-400 hover:text-white rounded-full transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-[#3a3a3a] rounded-[3rem]">
            <MessageSquare size={48} className="text-gray-700 mb-4" />
            <p className="text-gray-500 font-serif italic text-xl">No testimonials to display</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-[#3a3a3a] flex justify-between items-center">
                <h2 className="text-2xl font-serif font-bold text-[#d4af37]">
                  {editingItem ? "Edit Feedback" : "New Testimonial"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Role / Title</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none transition-all"
                    placeholder="e.g. Food Blogger"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Testimonial Content</label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none transition-all h-32 resize-none"
                    placeholder="The experience was..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    className="w-5 h-5 accent-gold bg-[#2a2a2a] border-[#3a3a3a] rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-gray-300 cursor-pointer">
                    Display on Homepage (Featured)
                  </label>
                </div>

                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-4 border border-[#3a3a3a] text-gray-400 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#d4af37] text-black rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                  >
                    <Save size={16} />
                    {editingItem ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
