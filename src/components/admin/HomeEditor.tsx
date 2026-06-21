import React, { useState } from 'react';
import { SiteContent, GalleryItem } from '../../types';
import { updateHomeContent } from '../../lib/site/getHomeContent';
import { addGalleryItem, deleteGalleryItem, uploadGalleryMedia } from '../../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Upload, Loader2, Save, Image as ImageIcon, Video, Link as LinkIcon, Type, Eye, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../lib/image';
import MediaUploader from './MediaUploader';

interface HomeEditorProps {
  initialContent: SiteContent;
  initialGallery: GalleryItem[];
  onRefresh: () => void;
}

export default function HomeEditor({ initialContent, initialGallery, onRefresh }: HomeEditorProps) {
  const [content, setContent] = useState<SiteContent>(initialContent || {});
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'founder' | 'gallery'>('hero');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateHomeContent(content);
      toast.success('Home content updated successfully');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const isVideo = file.type.startsWith('video/');
      const media_url = await uploadGalleryMedia(file);
      
      await addGalleryItem({
        media_url,
        media_type: isVideo ? 'video' : 'image',
        is_featured: true
      });
      
      toast.success('Gallery item added');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGalleryItem = async (id: string) => {
    if (!confirm('Are you sure you want to remove this from the home gallery?')) return;
    try {
      await deleteGalleryItem(id);
      toast.success('Item removed');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting item');
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#3a3a3a] overflow-hidden flex flex-col md:flex-row min-h-[700px]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-[#2a2a2a] p-6 border-b md:border-b-0 md:border-r border-[#3a3a3a] flex flex-col gap-2">
        <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">Sections</h3>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'hero' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Video size={18} /> Hero
        </button>
        <button
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'story' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Type size={18} /> Brand Story
        </button>
        <button
          onClick={() => setActiveTab('founder')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'founder' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <HelpCircle size={18} /> Founder
        </button>
        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeTab === 'gallery' ? 'bg-[#d4af37] text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <ImageIcon size={18} /> Home Gallery
        </button>

        <div className="mt-auto pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-[#d4af37] text-black py-3 px-4 rounded-xl font-bold hover:bg-[#c4a030] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? 'Saving...' : 'Publish Content'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-3xl"
            >
              <h2 className="text-2xl font-serif text-[#d4af37] mb-6">Hero Section</h2>
              
              <div className="flex items-center justify-between p-4 bg-[#2a2a2a] border border-[#3a3a3a] rounded-2xl mb-8">
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Enable Custom Hero</label>
                  <p className="text-xs text-gray-400">Turn this on to override the static hero design.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.hero_enabled === 'true'}
                    onChange={(e) => setContent({ ...content, hero_enabled: e.target.checked ? 'true' : 'false' })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]"></div>
                </label>
              </div>

              <div className="space-y-6">
                <MediaUploader
                  currentMedia={content.hero_video_url}
                  onUploadSuccess={(asset) => setContent({ ...content, hero_video_url: asset.url })}
                  onRemove={() => setContent({ ...content, hero_video_url: '' })}
                  folder="hero"
                  label="Upload Hero Video"
                  accept="video/mp4,video/webm,video/quicktime"
                />

                <MediaUploader
                  currentMedia={content.hero_poster_url}
                  onUploadSuccess={(asset) => setContent({ ...content, hero_poster_url: asset.url })}
                  onRemove={() => setContent({ ...content, hero_poster_url: '' })}
                  folder="poster"
                  label="Upload Fallback Poster"
                  accept="image/jpeg,image/png,image/webp"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Top Badge Text</label>
                <input
                  type="text"
                  value={content.hero_badge || ''}
                  onChange={(e) => setContent({ ...content, hero_badge: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="IZ PATISSERIE & CAFE, Dhaka"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Title Line 1</label>
                <input
                  type="text"
                  value={content.hero_title_line_1 || ''}
                  onChange={(e) => setContent({ ...content, hero_title_line_1: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="Your Cozy Pastry"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Title Line 2 (Italic)</label>
                <input
                  type="text"
                  value={content.hero_title_line_2 || ''}
                  onChange={(e) => setContent({ ...content, hero_title_line_2: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="& Coffee Escape"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">CTA Button Text</label>
                  <input
                    type="text"
                    value={content.hero_cta_text || ''}
                    onChange={(e) => setContent({ ...content, hero_cta_text: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                    placeholder="View Menu"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">CTA Button Link</label>
                  <input
                    type="text"
                    value={content.hero_cta_link || ''}
                    onChange={(e) => setContent({ ...content, hero_cta_link: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                    placeholder="/menu"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'story' && (
            <motion.div
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-3xl"
            >
              <h2 className="text-2xl font-serif text-[#d4af37] mb-6">Brand Story</h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Story Heading</label>
                <input
                  type="text"
                  value={content.story_heading || ''}
                  onChange={(e) => setContent({ ...content, story_heading: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="Where the bustle of Dhaka fades..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Story Highlight (Italic)</label>
                <input
                  type="text"
                  value={content.story_highlight || ''}
                  onChange={(e) => setContent({ ...content, story_highlight: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                  placeholder="Dhaka."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Paragraph 1</label>
                <textarea
                  value={content.story_paragraph_1 || ''}
                  onChange={(e) => setContent({ ...content, story_paragraph_1: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none h-32 resize-none"
                  placeholder="We started small..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Paragraph 2</label>
                <textarea
                  value={content.story_paragraph_2 || ''}
                  onChange={(e) => setContent({ ...content, story_paragraph_2: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none h-32 resize-none"
                  placeholder="In the bustling streets..."
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'founder' && (
            <motion.div
              key="founder"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 max-w-3xl"
            >
              <h2 className="text-2xl font-serif text-[#d4af37] mb-6">Founder Profile</h2>

              <div className="flex items-center gap-8 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-[#2a2a2a] border-2 border-[#3a3a3a] flex-shrink-0">
                  {content.founder_avatar ? (
                    <img src={content.founder_avatar} alt="Avatar" className="w-full h-full object-cover grayscale" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Avatar URL</label>
                  <input
                    type="text"
                    value={content.founder_avatar || ''}
                    onChange={(e) => setContent({ ...content, founder_avatar: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Founder Name</label>
                  <input
                    type="text"
                    value={content.founder_name || ''}
                    onChange={(e) => setContent({ ...content, founder_name: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                    placeholder="Ibrahim Z."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Founder Role</label>
                  <input
                    type="text"
                    value={content.founder_role || ''}
                    onChange={(e) => setContent({ ...content, founder_role: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none"
                    placeholder="Founder & Head Baker"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-[#d4af37]">Home Gallery</h2>
                
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleGalleryUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <button
                    disabled={uploading}
                    className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-white/10 text-white px-4 py-2 rounded-xl border border-[#3a3a3a] transition-colors"
                  >
                    {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                    {uploading ? 'Uploading...' : 'Upload Media'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {initialGallery.length === 0 ? (
                  <div className="col-span-full p-12 border-2 border-dashed border-[#3a3a3a] rounded-2xl flex flex-col items-center justify-center text-gray-500">
                    <ImageIcon size={48} className="mb-4 opacity-50" />
                    <p>No gallery items yet.</p>
                    <p className="text-sm">Upload media to show on the homepage.</p>
                  </div>
                ) : (
                  initialGallery.map((item) => (
                    <div key={item.id} className="relative group aspect-square rounded-xl overflow-hidden bg-[#2a2a2a] border border-[#3a3a3a]">
                      <img
                        src={getImageUrl(item.media_url, "gallery-media")}
                        alt="Gallery item"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <button
                          onClick={() => handleDeleteGalleryItem(item.id)}
                          className="w-10 h-10 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Note: The homepage gallery displays images dynamically. Reordering is based on upload time.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
