import { useState, ChangeEvent, KeyboardEvent, FormEvent } from "react";
import { X, Save, Upload, Plus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Location } from "../../types";
import { uploadLocationMedia } from "../../lib/supabase";
import toast from "react-hot-toast";

interface LocationFormProps {
  location?: Location | null;
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function LocationForm({ location, onSubmit, onClose }: LocationFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: location?.name || "",
    address: location?.address || "",
    description: location?.description || "",
    cover_image: location?.cover_image || "",
  });

  const [tags, setTags] = useState<string[]>(
    location?.location_tags?.map(t => t.label) || []
  );
  const [tagInput, setTagInput] = useState("");

  const [gallery, setGallery] = useState<string[]>(
    location?.location_gallery?.map(g => g.image_url) || []
  );

  const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadLocationMedia(file, location?.id || 'new');
      setFormData({ ...formData, cover_image: url });
      toast.success("Cover image uploaded");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const urls = await Promise.all(
        files.map((file: any) => uploadLocationMedia(file as File, location?.id || 'new'))
      );
      setGallery([...gallery, ...urls]);
      toast.success(`${files.length} gallery images uploaded`);
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

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

  const removeGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.cover_image) {
      toast.error("Please fill in name, address, and cover image");
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        ...formData,
        tags,
        gallery
      });
      onClose();
    } catch (error: any) {
      toast.error("Error saving location: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
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

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
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
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#d4af37] transition-all text-sm h-40 resize-none font-light leading-relaxed"
                  placeholder="Tell us about this space..."
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
              {/* Cover Image */}
              <div className="space-y-4">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 text-white">Cover Image</label>
                <div className="relative group aspect-video rounded-3xl overflow-hidden bg-[#2a2a2a] border-2 border-dashed border-[#3a3a3a] hover:border-[#d4af37] transition-all">
                  {formData.cover_image ? (
                    <>
                      <img
                        src={formData.cover_image}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all hover:scale-105">
                          Change Image
                          <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
                        </label>
                      </div>
                    </>
                  ) : (
                    <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                      <div className="p-4 bg-[#1a1a1a] rounded-full text-gray-400 mb-2 group-hover:text-[#d4af37]">
                        <Upload size={32} />
                      </div>
                      <span className="text-gray-400 text-xs font-bold uppercase tracking-widest group-hover:text-white">Upload Cover</span>
                      <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} disabled={uploading} />
                    </label>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#d4af37]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 text-white">Space Gallery</label>
                  <label className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-[#d4af37] hover:underline">
                    Add Media
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} />
                  </label>
                </div>
                
                <div className="grid grid-cols-3 gap-3 p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-[2rem] min-h-[150px]">
                  {gallery.map((url, i) => (
                    <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#3a3a3a] rounded-2xl text-gray-500 hover:text-[#d4af37] hover:border-[#d4af37] cursor-pointer transition-all aspect-square">
                    <Plus size={24} />
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading} />
                  </label>
                </div>
              </div>
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
              disabled={loading || uploading}
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
