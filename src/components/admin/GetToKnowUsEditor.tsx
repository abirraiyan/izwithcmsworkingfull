import React, { useState } from 'react';
import { GetToKnowUsContent, PhilosophyCard } from '../../types/getToKnowUs';
import { useGetToKnowUs } from '../../hooks/useGetToKnowUs';
import UniversalUploader from './UniversalUploader';
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import toast from 'react-hot-toast';

interface GetToKnowUsEditorProps {
  initialContent: GetToKnowUsContent;
  onRefresh: () => void;
}

export default function GetToKnowUsEditor({ initialContent, onRefresh }: GetToKnowUsEditorProps) {
  const { saveContent, saving } = useGetToKnowUs();
  const [content, setContent] = useState<GetToKnowUsContent>(initialContent);

  const updateSection = (section: keyof GetToKnowUsContent, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      await saveContent(content);
      onRefresh();
    } catch (error) {
      // Error handled in hook
    }
  };

  const addCard = () => {
    const newCard: PhilosophyCard = {
      id: Date.now().toString(),
      icon: 'heart',
      title: 'New Value',
      description: 'Value description',
      accentColor: '#d4af37',
      hoverEffect: 'lift',
      enabled: true,
      order: content.philosophy.cards.length
    };
    
    updateSection('philosophy', 'cards', [...content.philosophy.cards, newCard]);
  };

  const updateCard = (index: number, field: keyof PhilosophyCard, value: any) => {
    const newCards = [...content.philosophy.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    updateSection('philosophy', 'cards', newCards);
  };

  const removeCard = (index: number) => {
    const newCards = [...content.philosophy.cards];
    newCards.splice(index, 1);
    updateSection('philosophy', 'cards', newCards);
  };

  const moveCard = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === content.philosophy.cards.length - 1)
    ) return;

    const newCards = [...content.philosophy.cards];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newCards[index], newCards[swapIndex]] = [newCards[swapIndex], newCards[index]];
    
    // Update order values
    newCards.forEach((c, i) => c.order = i);
    
    updateSection('philosophy', 'cards', newCards);
  };

  return (
    <div className="max-w-5xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-8 sticky top-20 bg-[#0f0f0f]/90 backdrop-blur-md p-4 rounded-2xl z-10 border border-[#3a3a3a]">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Get To Know Us CMS</h1>
          <p className="text-gray-400">Manage your page content, founders, and philosophy cards.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#d4af37] text-black px-6 py-3 rounded-xl font-bold hover:bg-[#c8a86b] transition-all disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Publishing...' : 'Publish Content'}
        </button>
      </div>

      <div className="space-y-8">
        
        {/* SECTION A: Settings */}
        <section className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-[#3a3a3a]">
          <h2 className="text-2xl font-serif text-[#d4af37] mb-6">Page Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Background Color</label>
              <input
                type="text"
                value={content.settings.background}
                onChange={e => updateSection('settings', 'background', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                placeholder="#FAF8F5"
              />
            </div>
            
            <div className="flex items-center h-full pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.settings.enableAnimation}
                  onChange={e => updateSection('settings', 'enableAnimation', e.target.checked)}
                  className="w-5 h-5 rounded border-[#3a3a3a] text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-[#0f0f0f] bg-[#0f0f0f]"
                />
                <span className="text-sm font-medium text-white">Enable Animations</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Animation Intensity</label>
              <select
                value={content.settings.animationIntensity}
                onChange={e => updateSection('settings', 'animationIntensity', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              >
                <option value="low">Low (Opacity only)</option>
                <option value="medium">Medium (Fade & Slide)</option>
                <option value="high">High (Parallax & Float)</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECTION B: Founders */}
        <section className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-[#3a3a3a]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-[#d4af37]">Meet Founders</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-400">Enabled</span>
              <input
                type="checkbox"
                checked={content.founders.enabled}
                onChange={e => updateSection('founders', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded border-[#3a3a3a] text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-[#0f0f0f] bg-[#0f0f0f]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Heading</label>
              <input
                type="text"
                value={content.founders.heading}
                onChange={e => updateSection('founders', 'heading', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Paragraph 1</label>
              <textarea
                value={content.founders.paragraph1}
                onChange={e => updateSection('founders', 'paragraph1', e.target.value)}
                rows={3}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Paragraph 2</label>
              <textarea
                value={content.founders.paragraph2}
                onChange={e => updateSection('founders', 'paragraph2', e.target.value)}
                rows={3}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Quote</label>
              <textarea
                value={content.founders.quote}
                onChange={e => updateSection('founders', 'quote', e.target.value)}
                rows={2}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors italic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-t border-[#3a3a3a] pt-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Left Image</label>
              <UniversalUploader
                label="Left Founder Image"
                value={content.founders.imageLeft?.url}
                onChange={(url) => {
                  const urlStr = url as string;
                  if (urlStr) {
                    updateSection('founders', 'imageLeft', {
                      url: urlStr,
                      type: urlStr.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
                      mimeType: urlStr.match(/\.(mp4|webm|mov)$/i) ? 'video/mp4' : 'image/jpeg'
                    });
                  } else {
                    updateSection('founders', 'imageLeft', null);
                  }
                }}
                folder="cms/get-to-know-us/founders"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Image Shape</label>
                <select
                  value={content.founders.imageLeftShape}
                  onChange={e => updateSection('founders', 'imageLeftShape', e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="rounded">Rounded</option>
                  <option value="circle">Circle</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Right Image</label>
              <UniversalUploader
                label="Right Founder Image"
                value={content.founders.imageRight?.url}
                onChange={(url) => {
                  const urlStr = url as string;
                  if (urlStr) {
                    updateSection('founders', 'imageRight', {
                      url: urlStr,
                      type: urlStr.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
                      mimeType: urlStr.match(/\.(mp4|webm|mov)$/i) ? 'video/mp4' : 'image/jpeg'
                    });
                  } else {
                    updateSection('founders', 'imageRight', null);
                  }
                }}
                folder="cms/get-to-know-us/founders"
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">Image Shape</label>
                <select
                  value={content.founders.imageRightShape}
                  onChange={e => updateSection('founders', 'imageRightShape', e.target.value)}
                  className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none"
                >
                  <option value="rounded">Rounded</option>
                  <option value="circle">Circle</option>
                  <option value="organic">Organic</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-[#3a3a3a] pt-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Background Image</label>
              <UniversalUploader
                label="Section Background"
                value={content.founders.backgroundMedia?.url}
                onChange={(url) => {
                  const urlStr = url as string;
                  if (urlStr) {
                    updateSection('founders', 'backgroundMedia', {
                      url: urlStr,
                      type: urlStr.match(/\.(mp4|webm|mov)$/i) ? 'video' : 'image',
                      mimeType: urlStr.match(/\.(mp4|webm|mov)$/i) ? 'video/mp4' : 'image/jpeg'
                    });
                  } else {
                    updateSection('founders', 'backgroundMedia', null);
                  }
                }}
                folder="cms/get-to-know-us/backgrounds"
              />
            </div>
          </div>
        </section>

        {/* SECTION C: Philosophy */}
        <section className="bg-[#1a1a1a] rounded-2xl p-6 md:p-8 border border-[#3a3a3a]">
           <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-[#d4af37]">Philosophy Cards</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-gray-400">Enabled</span>
              <input
                type="checkbox"
                checked={content.philosophy.enabled}
                onChange={e => updateSection('philosophy', 'enabled', e.target.checked)}
                className="w-5 h-5 rounded border-[#3a3a3a] text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-[#0f0f0f] bg-[#0f0f0f]"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Badge Text</label>
              <input
                type="text"
                value={content.philosophy.badge}
                onChange={e => updateSection('philosophy', 'badge', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subtitle</label>
              <input
                type="text"
                value={content.philosophy.subtitle}
                onChange={e => updateSection('philosophy', 'subtitle', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title (Normal)</label>
              <input
                type="text"
                value={content.philosophy.titleNormal}
                onChange={e => updateSection('philosophy', 'titleNormal', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title (Accent)</label>
              <input
                type="text"
                value={content.philosophy.titleAccent}
                onChange={e => updateSection('philosophy', 'titleAccent', e.target.value)}
                className="w-full bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-4">
            {content.philosophy.cards.map((card, idx) => (
              <div key={card.id} className="bg-[#0f0f0f] border border-[#3a3a3a] rounded-xl p-6 relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button onClick={() => moveCard(idx, 'up')} disabled={idx === 0} className="p-2 text-gray-400 hover:text-white disabled:opacity-30">
                    <ArrowUp size={18} />
                  </button>
                  <button onClick={() => moveCard(idx, 'down')} disabled={idx === content.philosophy.cards.length - 1} className="p-2 text-gray-400 hover:text-white disabled:opacity-30">
                    <ArrowDown size={18} />
                  </button>
                  <button onClick={() => removeCard(idx)} className="p-2 text-red-400 hover:text-red-300 ml-2 bg-red-400/10 rounded-lg">
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <h4 className="text-[#d4af37] font-serif text-lg mb-4">Card {idx + 1}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={e => updateCard(idx, 'title', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Icon</label>
                    <select
                      value={card.icon}
                      onChange={e => updateCard(idx, 'icon', e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm"
                    >
                      <option value="heart">Heart</option>
                      <option value="star">Star</option>
                      <option value="coffee">Coffee</option>
                      <option value="users">Users</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="chef">Chef</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                      value={card.description}
                      onChange={e => updateCard(idx, 'description', e.target.value)}
                      rows={2}
                      className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addCard}
            className="w-full mt-6 py-4 border-2 border-dashed border-[#3a3a3a] text-gray-400 hover:text-[#d4af37] hover:border-[#d4af37] rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Philosophy Card
          </button>
        </section>

      </div>
    </div>
  );
}
