import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMenuItems, getCategories, updateMenuItem, addMenuItem, getImageUrl, supabase } from '../../lib/supabase';
import { Category, MenuItem } from '../../types';
import MenuForm from '../../components/MenuForm';
import toast from 'react-hot-toast';

export default function MenuManager() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        getMenuItems(false),
        getCategories()
      ]);
      setItems(itemsData);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const { error } = await supabase
        .from("menu_items")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      
      // refresh UI
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success('Item deleted');
    } catch (err: any) {
      console.error("Delete failed:", err.message);
      alert("Delete failed");
      toast.error('Failed to delete item');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (editingItem) {
      const updated = await updateMenuItem(editingItem.id, formData);
      setItems(items.map(item => item.id === editingItem.id ? { ...updated, categories: categories.find(c => c.id === updated.category_id) } : item));
    } else {
      const added = await addMenuItem(formData);
      setItems([{ ...added, categories: categories.find(c => c.id === added.category_id) }, ...items]);
    }
    fetchData(); // Refresh to get joined category names properly
  };

  const filteredItems = useMemo(() => 
    items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
    [items, searchTerm, selectedCategory]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#d4af37]">Menu Management</h1>
          <p className="text-gray-400">Manage your bakery's delicious offerings</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#d4af37]/20"
        >
          <Plus size={20} />
          Add New Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-[#d4af37]" size={40} />
          <p className="text-gray-400">Loading menu items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl overflow-hidden hover:border-[#d4af37]/50 transition-all hover:shadow-xl hover:shadow-black/40"
              >
                  <div className="relative aspect-square overflow-hidden bg-[#2a2a2a]">
                    <img
                      src={getImageUrl(item.image_url, "menu-images")}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
                      }}
                    />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsFormOpen(true);
                      }}
                      className="p-2 bg-white/10 backdrop-blur-md hover:bg-[#d4af37] hover:text-black text-white rounded-lg transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-white/10 backdrop-blur-md hover:bg-red-500 text-white rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-[#d4af37] text-xs font-bold rounded-full border border-[#d4af37]/30">
                      {item.categories?.name || 'Uncategorized'}
                    </span>
                    {!item.is_available && (
                      <span className="px-3 py-1 bg-red-500/80 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg text-white line-clamp-1">{item.name}</h3>
                  </div>
                  <div className="space-y-1">
                    {item.variants && item.variants.length > 0 ? (
                      item.variants.map((v) => (
                        <div key={v.id} className="flex justify-between text-xs">
                          <span className="text-gray-400">{v.name}</span>
                          <span className="text-[#d4af37] font-bold">৳{v.price.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[#d4af37] font-bold">৳{item.price?.toFixed(2) || '0.00'}</span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-2 min-h-[2.5rem] mt-2">
                    {item.description || 'No description provided.'}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-20 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl">
          <p className="text-gray-400">No menu items found.</p>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <MenuForm
            item={editingItem}
            categories={categories}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
