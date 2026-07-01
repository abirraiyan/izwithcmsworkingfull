import React, { useState } from 'react';
import { OurStoryContent, OurStoryPhilosophyCard, OurStoryGalleryImage } from '../../types';
import { updateOurStoryContent } from '../../lib/site/ourStoryContent';
import UniversalUploader from './UniversalUploader';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface OurStoryEditorProps {
  initialContent: OurStoryContent;
  onRefresh: () => void;
}

export default function OurStoryEditor({ initialContent, onRefresh }: OurStoryEditorProps) {
  const [content, setContent] = useState<OurStoryContent>(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update deeply nested states
  const updateSection = (section: keyof OurStoryContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateOurStoryContent(content);
      toast.success('Our Story content saved successfully!');
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const addPhilosophyCard = () => {
    const cards = content.philosophy?.cards || [];
    const newCard: OurStoryPhilosophyCard = {
      id: Math.random().toString(36).substring(7),
      title: 'New Value',
      description: 'Value description',
      image: '',
      sort_order: cards.length
    };
    updateSection('philosophy', 'cards', [...cards, newCard]);
  };

  const removePhilosophyCard = (id: string) => {
    const cards = content.philosophy?.cards?.filter(c => c.id !== id) || [];
    updateSection('philosophy', 'cards', cards);
  };

  const updatePhilosophyCard = (id: string, field: string, value: any) => {
    const cards = content.philosophy?.cards?.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ) || [];
    updateSection('philosophy', 'cards', cards);
  };

  const movePhilosophyCard = (index: number, direction: 'up' | 'down') => {
    const cards = [...(content.philosophy?.cards || [])];
    if (direction === 'up' && index > 0) {
      [cards[index - 1], cards[index]] = [cards[index], cards[index - 1]];
    } else if (direction === 'down' && index < cards.length - 1) {
      [cards[index + 1], cards[index]] = [cards[index], cards[index + 1]];
    }
    // Update sort_orders to reflect array order
    cards.forEach((c, i) => c.sort_order = i);
    updateSection('philosophy', 'cards', cards);
  };

  const addGalleryImage = () => {
    const gallery = content.gallery || [];
    const newImage: OurStoryGalleryImage = {
      id: Math.random().toString(36).substring(7),
      image_url: '',
      caption: '',
      sort_order: gallery.length
    };
    setContent(prev => ({ ...prev, gallery: [...gallery, newImage] }));
  };

  const removeGalleryImage = (id: string) => {
    const gallery = content.gallery?.filter(c => c.id !== id) || [];
    setContent(prev => ({ ...prev, gallery }));
  };

  const updateGalleryImage = (id: string, field: string, value: any) => {
    const gallery = content.gallery?.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ) || [];
    setContent(prev => ({ ...prev, gallery }));
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const gallery = [...(content.gallery || [])];
    if (direction === 'up' && index > 0) {
      [gallery[index - 1], gallery[index]] = [gallery[index], gallery[index - 1]];
    } else if (direction === 'down' && index < gallery.length - 1) {
      [gallery[index + 1], gallery[index]] = [gallery[index], gallery[index + 1]];
    }
    gallery.forEach((c, i) => c.sort_order = i);
    setContent(prev => ({ ...prev, gallery }));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Save Button Fixed Top */}
      <div className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-md py-4 border-b border-[#3a3a3a] flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#d4af37] text-black font-bold uppercase tracking-wider rounded-xl hover:bg-[#c4a030] transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          {isSaving ? 'Saving...' : 'Publish Content'}
        </button>
      </div>

      {/* SECTION 1: Hero */}
      <section className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#3a3a3a]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">1. Hero Section</h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={content.hero?.enabled !== false} // default true
                onChange={(e) => updateSection('hero', 'enabled', e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${content.hero?.enabled !== false ? 'bg-[#d4af37]' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${content.hero?.enabled !== false ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm text-gray-300">Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Badge Text</label>
              <input
                type="text"
                value={content.hero?.badge_text || 'Since 2020'}
                onChange={(e) => updateSection('hero', 'badge_text', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Title</label>
              <input
                type="text"
                value={content.hero?.title || 'Our Story'}
                onChange={(e) => updateSection('hero', 'title', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Overlay Opacity (0-100)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={content.hero?.overlay_opacity ?? 40}
                onChange={(e) => updateSection('hero', 'overlay_opacity', parseInt(e.target.value))}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
          <div>
            <UniversalUploader
              folder="our_story"
              label="Hero Background Image"
              accept="image/*,video/*"
              value={content.hero?.hero_image}
              onChange={(url) => updateSection('hero', 'hero_image', url as string || '')}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: Journey */}
      <section className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#3a3a3a]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">2. Narrative Journey</h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={content.journey?.enabled !== false}
                onChange={(e) => updateSection('journey', 'enabled', e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${content.journey?.enabled !== false ? 'bg-[#d4af37]' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${content.journey?.enabled !== false ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm text-gray-300">Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Title</label>
                <input
                  type="text"
                  value={content.journey?.title || 'A Journey of'}
                  onChange={(e) => updateSection('journey', 'title', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Highlighted Word</label>
                <input
                  type="text"
                  value={content.journey?.highlighted_word || 'Passion'}
                  onChange={(e) => updateSection('journey', 'highlighted_word', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Paragraph 1</label>
              <textarea
                rows={3}
                value={content.journey?.paragraph_1 || ''}
                onChange={(e) => updateSection('journey', 'paragraph_1', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Paragraph 2</label>
              <textarea
                rows={3}
                value={content.journey?.paragraph_2 || ''}
                onChange={(e) => updateSection('journey', 'paragraph_2', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Paragraph 3</label>
              <textarea
                rows={3}
                value={content.journey?.paragraph_3 || ''}
                onChange={(e) => updateSection('journey', 'paragraph_3', e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>
          <div>
            <UniversalUploader
              folder="our_story"
              label="Side Image"
              accept="image/*,video/*"
              value={content.journey?.side_image}
              onChange={(url) => updateSection('journey', 'side_image', url as string || '')}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: Philosophy */}
      <section className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#3a3a3a]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">3. Baking Philosophy</h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={content.philosophy?.enabled !== false}
                onChange={(e) => updateSection('philosophy', 'enabled', e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${content.philosophy?.enabled !== false ? 'bg-[#d4af37]' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${content.philosophy?.enabled !== false ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm text-gray-300">Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Title</label>
            <input
              type="text"
              value={content.philosophy?.title || 'The Art of'}
              onChange={(e) => updateSection('philosophy', 'title', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Subtitle</label>
            <input
              type="text"
              value={content.philosophy?.subtitle || 'Baking'}
              onChange={(e) => updateSection('philosophy', 'subtitle', e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#d4af37]">Feature Cards</h3>
            <button onClick={addPhilosophyCard} className="flex items-center gap-1 text-sm bg-[#2a2a2a] px-3 py-1.5 rounded-lg hover:bg-[#3a3a3a]">
              <Plus size={16} /> Add Card
            </button>
          </div>
          
          {(content.philosophy?.cards || []).sort((a,b)=>a.sort_order-b.sort_order).map((card, index) => (
            <div key={card.id} className="bg-[#2a2a2a] border border-[#3a3a3a] p-4 rounded-xl flex gap-6">
              <div className="flex flex-col gap-2">
                <button onClick={() => movePhilosophyCard(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30"><ArrowUp size={16}/></button>
                <button onClick={() => movePhilosophyCard(index, 'down')} disabled={index === (content.philosophy?.cards?.length || 0) - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30"><ArrowDown size={16}/></button>
                <button onClick={() => removePhilosophyCard(card.id)} className="p-1 text-red-400 hover:text-red-300 mt-auto"><Trash2 size={16}/></button>
              </div>
              <div className="w-48">
                <UniversalUploader
                  folder="our_story"
                  label="Image"
                  accept="image/*,video/*"
                  value={card.image}
                  onChange={(url) => updatePhilosophyCard(card.id, 'image', url as string || '')}
                />
              </div>
              <div className="flex-1 space-y-4">
                <input
                  type="text"
                  placeholder="Card Title"
                  value={card.title}
                  onChange={(e) => updatePhilosophyCard(card.id, 'title', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                />
                <textarea
                  rows={3}
                  placeholder="Card Description"
                  value={card.description}
                  onChange={(e) => updatePhilosophyCard(card.id, 'description', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Gallery */}
      <section className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#3a3a3a]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">4. Inline Gallery</h2>
          <button onClick={addGalleryImage} className="flex items-center gap-1 text-sm bg-[#d4af37] text-black font-bold px-4 py-2 rounded-lg hover:bg-[#c4a030]">
            <Plus size={16} /> Add Image
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(content.gallery || []).sort((a,b)=>a.sort_order-b.sort_order).map((img, index) => (
            <div key={img.id} className="bg-[#2a2a2a] border border-[#3a3a3a] p-4 rounded-xl flex gap-4">
               <div className="flex flex-col gap-2">
                <button onClick={() => moveGalleryImage(index, 'up')} disabled={index === 0} className="p-1 text-gray-400 hover:text-white disabled:opacity-30"><ArrowUp size={16}/></button>
                <button onClick={() => moveGalleryImage(index, 'down')} disabled={index === (content.gallery?.length || 0) - 1} className="p-1 text-gray-400 hover:text-white disabled:opacity-30"><ArrowDown size={16}/></button>
                <button onClick={() => removeGalleryImage(img.id)} className="p-1 text-red-400 hover:text-red-300 mt-auto"><Trash2 size={16}/></button>
              </div>
              <div className="w-1/2">
                <UniversalUploader
                  folder="our_story"
                  label="Gallery Photo"
                  accept="image/*,video/*"
                  value={img.image_url}
                  onChange={(url) => updateGalleryImage(img.id, 'image_url', url as string || '')}
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                 <input
                  type="text"
                  placeholder="Optional Caption"
                  value={img.caption}
                  onChange={(e) => updateGalleryImage(img.id, 'caption', e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Founder */}
      <section className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#3a3a3a]">
         <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">5. Founder Profile</h2>
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={content.founder?.enabled !== false}
                onChange={(e) => updateSection('founder', 'enabled', e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${content.founder?.enabled !== false ? 'bg-[#d4af37]' : 'bg-gray-600'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${content.founder?.enabled !== false ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm text-gray-300">Enabled</span>
          </label>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  value={content.founder?.founder_name || ''}
                  onChange={(e) => updateSection('founder', 'founder_name', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Title/Role</label>
                <input
                  type="text"
                  value={content.founder?.founder_title || ''}
                  onChange={(e) => updateSection('founder', 'founder_title', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Founder Story / Quote</label>
                <textarea
                  rows={4}
                  value={content.founder?.founder_story || ''}
                  onChange={(e) => updateSection('founder', 'founder_story', e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>
           </div>
           <div>
            <UniversalUploader
              folder="our_story"
              label="Founder Photo"
              accept="image/*,video/*"
              value={content.founder?.founder_photo}
              onChange={(url) => updateSection('founder', 'founder_photo', url as string || '')}
            />
          </div>
        </div>
      </section>

    </div>
  );
}
