import { useState, KeyboardEvent, FormEvent } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Location } from "../../types";
import UniversalUploader from "./UniversalUploader";
import toast from "react-hot-toast";

interface LocationFormProps {
  location?: Location | null;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function LocationForm({ location, onSubmit: onSave, onClose }: LocationFormProps) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: location?.name || "",
    address: location?.address || "",
    description: location?.description || "",
    reservation_phone: location?.reservation_phone || "",
    opening_hours: location?.opening_hours || "",
    corporate_email: location?.corporate_email || "",
    directions_url: location?.directions_url || "",
    reservation_url: location?.reservation_url || "",
    about_title: location?.about_title || "",
    about_content: location?.about_content || "",
    sort_order: location?.sort_order ?? 0,
    is_published: location?.is_published ?? true,
    cover_image: location?.cover_image || ""
  });

  const [tags, setTags] = useState<string[]>(
    location?.location_tags?.map(t => t.label) || []
  );
  const [gallery, setGallery] = useState<string[]>(
    location?.location_gallery?.map(g => g.image_url) || []
  );
  const [tagInput, setTagInput] = useState("");

  const addTag = (e: KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.cover_image) {
      toast.error("Please fill in name, address, and cover image");
      return;
    }

    try {
      setLoading(true);
      await onSave({
        ...formData,
        tags,
        gallery,
        updated_at: new Date().toISOString()
      });
      onClose();
    } catch (error: any) {
      if (error.message === "Database schema needs migration. Run sync.") {
        toast.error("Database schema needs migration. Run sync.");
      } else {
        toast.error("Error saving location: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-none sm:rounded-[2.5rem] w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-[#3a3a3a] bg-[#1a1a1a]">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#d4af37]">
              {location ? "Edit Space" : "New Space"}
            </h2>
            <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">
              IZ Pâtisserie & Café Locations
            </p>
          </div>
          <button onClick={onClose} className="p-3 bg-[#2a2a2a] hover:bg-white/10 rounded-full transition-colors text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-6 text-white">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-2">Location Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all font-serif text-lg"
                  placeholder="e.g. IZ - Gulshan Branch"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Reservation Phone</label>
                  <input
                    type="text"
                    value={formData.reservation_phone}
                    onChange={(e) => setFormData({ ...formData, reservation_phone: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                    placeholder="+880 13..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Trading Hours</label>
                  <input
                    type="text"
                    value={formData.opening_hours}
                    onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                    placeholder="Daily: 8:00 AM - 11:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Corporate Email</label>
                  <input
                    type="email"
                    value={formData.corporate_email}
                    onChange={(e) => setFormData({ ...formData, corporate_email: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                    placeholder="hello@izpatisserie.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Directions URL</label>
                  <input
                    type="url"
                    value={formData.directions_url}
                    onChange={(e) => setFormData({ ...formData, directions_url: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Reservation URL</label>
                  <input
                    type="url"
                    value={formData.reservation_url}
                    onChange={(e) => setFormData({ ...formData, reservation_url: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl">
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Publish Location</label>
                  <p className="text-xs text-gray-400">If unchecked, this location will be hidden from the guest site.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm h-24 resize-none"
                  placeholder="Full physical address..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm h-24 resize-none"
                  placeholder="Short summary for previews..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About Title</label>
                <input
                  type="text"
                  value={formData.about_title}
                  onChange={(e) => setFormData({ ...formData, about_title: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm"
                  placeholder="About the Space"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About Content</label>
                <textarea
                  value={formData.about_content || formData.description}
                  onChange={(e) => setFormData({ ...formData, about_content: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm h-32 resize-none font-light leading-relaxed"
                  placeholder="Discover a sanctuary..."
                />
              </div>

              {/* Tags Section */}
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Tags & Amenities</label>
                <div className="flex flex-wrap gap-2 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl min-h-[60px]">
                  <AnimatePresence>
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 text-[#d4af37] rounded-full text-[10px] font-bold uppercase tracking-wider"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-white">
                          <X size={12} />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value.toLowerCase())}
                    onKeyDown={addTag}
                    className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-gray-600 font-bold"
                    placeholder="Type and press Enter..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Media */}
            <div className="space-y-8">
              <UniversalUploader
                label="Cover Image"
                value={formData.cover_image}
                onChange={(url) => setFormData({ ...formData, cover_image: url as string || "" })}
              />

              <UniversalUploader
                label="Space Gallery"
                value={gallery}
                multiple
                onChange={(urls) => setGallery((urls as string[]) || [])}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-8 border-t border-[#3a3a3a]">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 px-8 text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-3 px-10 py-4 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all shadow-lg shadow-[#d4af37]/20 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {location ? "Save Changes" : "Create Space"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
