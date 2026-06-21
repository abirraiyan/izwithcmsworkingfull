import React, { useState, useEffect } from 'react';
import { getNavigationSettings, updateNavigationSettings, defaultNavigation } from '../../lib/site/getNavigationSettings';
import { NavigationItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Loader2, 
  Save, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function NavigationManager() {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Add new item state
  const [newItem, setNewItem] = useState({
    name: '',
    href: '',
    enabled: true,
    highlighted: false
  });

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getNavigationSettings();
      setItems(data);
    } catch (err: any) {
      toast.error('Failed to load navigation settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleFieldChange = (index: number, field: keyof NavigationItem, value: any) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setItems(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === items.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...items];
    
    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    // Update order values based on array position
    const ordered = updated.map((item, idx) => ({ ...item, order: idx }));
    setItems(ordered);
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name.trim() || !newItem.href.trim()) {
      toast.error('Name and URL are required');
      return;
    }

    const item: NavigationItem = {
      id: newItem.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: newItem.name.trim(),
      href: newItem.href.trim(),
      enabled: newItem.enabled,
      highlighted: newItem.highlighted,
      order: items.length
    };

    setItems([...items, item]);
    setNewItem({
      name: '',
      href: '',
      enabled: true,
      highlighted: false
    });
    toast.success('Added item to list. Remember to publish changes!');
  };

  const handleDeleteItem = (index: number) => {
    const item = items[index];
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      const updated = items.filter((_, idx) => idx !== index);
      const ordered = updated.map((item, idx) => ({ ...item, order: idx }));
      setItems(ordered);
      toast.success('Removed item. Remember to publish changes!');
    }
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset navigation to system defaults? All custom changes will be lost.')) {
      setItems(defaultNavigation.map((item, index) => ({ ...item, order: index })));
      toast.success('Reset list. Remember to publish changes!');
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateNavigationSettings(items);
      toast.success('Navigation published successfully!');
      fetchSettings();
    } catch (err: any) {
      toast.error(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mr-3" />
        <span>Loading navigation settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#d4af37] mb-2">Navigation Management</h1>
          <p className="text-gray-400">Configure site header navigation settings, order, and promotional buttons.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetToDefault}
            className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-white/5 text-gray-300 px-4 py-2.5 rounded-xl border border-[#3a3a3a] transition-all text-sm font-semibold"
          >
            <RefreshCw size={16} />
            Reset Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#c4a030] text-black px-6 py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 text-sm"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Publishing...' : 'Publish Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#3a3a3a] p-6 md:p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-serif text-[#d4af37]">Navigation Hierarchy</h2>
            
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 bg-[#2a2a2a] border rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 transition-all ${
                      item.enabled ? 'border-[#3a3a3a]' : 'border-[#3a3a3a]/40 opacity-50'
                    }`}
                  >
                    {/* Controls (Move up/down/delete) */}
                    <div className="flex md:flex-col gap-1 items-center justify-center">
                      <button
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move Up"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move Down"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">Label Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl px-3 py-2 text-white focus:border-[#d4af37] outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">URL Destination</label>
                        <div className="relative">
                          <LinkIcon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            value={item.href}
                            onChange={(e) => handleFieldChange(index, 'href', e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl pl-9 pr-3 py-2 text-white focus:border-[#d4af37] outline-none text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Toggle Properties */}
                    <div className="flex gap-4 w-full md:w-auto justify-between md:justify-start items-center border-t md:border-t-0 border-[#3a3a3a] pt-3 md:pt-0">
                      {/* Highlight toggle */}
                      <button
                        onClick={() => handleFieldChange(index, 'highlighted', !item.highlighted)}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-semibold ${
                          item.highlighted 
                            ? 'bg-gold/10 border-gold/40 text-[#d4af37]' 
                            : 'border-[#3a3a3a] text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        title="Toggle Outline Highlight Styling"
                      >
                        <Sparkles size={14} />
                        <span>CTA Style</span>
                      </button>

                      {/* Enable/Disable toggle */}
                      <button
                        onClick={() => handleFieldChange(index, 'enabled', !item.enabled)}
                        className={`p-2 rounded-xl border flex items-center gap-1.5 transition-all text-xs font-semibold ${
                          item.enabled 
                            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                        }`}
                        title="Toggle Visibility"
                      >
                        {item.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                        <span>{item.enabled ? 'Visible' : 'Hidden'}</span>
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all"
                        title="Delete Link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Add New Navigation Item Form */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#3a3a3a] p-6 md:p-8 space-y-6 shadow-xl sticky top-24">
            <h2 className="text-xl font-serif text-[#d4af37]">Add Navigation Link</h2>
            
            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Link Label</label>
                <input
                  type="text"
                  placeholder="e.g. Gallery"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">URL Destination</label>
                <input
                  type="text"
                  placeholder="e.g. /gallery or https://..."
                  value={newItem.href}
                  onChange={(e) => setNewItem({ ...newItem, href: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-xl px-4 py-3 text-white focus:border-[#d4af37] outline-none text-sm font-mono"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, highlighted: !newItem.highlighted })}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    newItem.highlighted 
                      ? 'bg-gold/10 border-gold/40 text-[#d4af37]' 
                      : 'border-[#3a3a3a] text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Sparkles size={14} />
                  Highlight Link
                </button>

                <button
                  type="button"
                  onClick={() => setNewItem({ ...newItem, enabled: !newItem.enabled })}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    newItem.enabled 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}
                >
                  {newItem.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                  {newItem.enabled ? 'Visible' : 'Hidden'}
                </button>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#c4a030] text-black py-3 rounded-xl font-bold transition-all text-sm mt-4"
              >
                <Plus size={16} />
                Add Link
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
