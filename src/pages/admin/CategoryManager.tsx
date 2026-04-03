import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Loader2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../lib/supabase';
import { Category } from '../../types';
import CategoryForm from '../../components/CategoryForm';
import toast from 'react-hot-toast';

export default function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure? Deleting a category might affect menu items.')) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted');
    } catch (error: any) {
      toast.error('Failed to delete category');
    }
  };

  const handleFormSubmit = async (name: string, parentId: string | null) => {
    if (editingCategory) {
      const updated = await updateCategory(editingCategory.id, name, parentId);
      setCategories(categories.map(cat => cat.id === editingCategory.id ? updated : cat));
    } else {
      const added = await addCategory(name, parentId);
      setCategories([...categories, added]);
    }
  };

  const renderCategory = (cat: Category, isChild = false) => (
    <motion.div
      key={cat.id}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`group flex items-center justify-between p-4 bg-[#1a1a1a] border border-[#3a3a3a] rounded-xl hover:border-[#d4af37]/50 transition-all ${isChild ? 'ml-8 border-l-2 border-l-[#d4af37]/30' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg bg-[#2a2a2a] text-[#d4af37] ${isChild ? 'scale-90' : ''}`}>
          <List size={isChild ? 16 : 20} />
        </div>
        <div>
          <h3 className={`font-bold text-white ${isChild ? 'text-sm' : ''}`}>{cat.name}</h3>
          <p className="text-xs text-gray-500">Created on {new Date(cat.created_at).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => {
            setEditingCategory(cat);
            setIsFormOpen(true);
          }}
          className="p-2 bg-[#2a2a2a] hover:bg-[#d4af37] hover:text-black text-gray-400 rounded-lg transition-all"
        >
          <Edit2 size={18} />
        </button>
        <button
          onClick={() => handleDelete(cat.id)}
          className="p-2 bg-[#2a2a2a] hover:bg-red-500 text-gray-400 hover:text-white rounded-lg transition-all"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );

  const parentCategories = categories.filter(c => !c.parent_id);
  const childCategories = categories.filter(c => c.parent_id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#d4af37]">Category Management</h1>
          <p className="text-gray-400">Organize your menu into logical groups and subgroups</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] hover:bg-[#c4a030] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#d4af37]/20"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-[#d4af37]" size={40} />
          <p className="text-gray-400">Loading categories...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {parentCategories.flatMap((parent) => [
              renderCategory(parent),
              ...childCategories
                .filter((child) => child.parent_id === parent.id)
                .map((child) => renderCategory(child, true))
            ])}
          </AnimatePresence>
        </div>
      )}

      {categories.length === 0 && !loading && (
        <div className="text-center py-20 bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl">
          <p className="text-gray-400">No categories found. Start by adding one!</p>
        </div>
      )}

      <AnimatePresence>
        {isFormOpen && (
          <CategoryForm
            category={editingCategory}
            categories={categories}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
