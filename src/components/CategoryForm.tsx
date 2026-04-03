import { useState, FormEvent } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Category } from '../types';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  category?: Category | null;
  categories: Category[];
  onSubmit: (name: string, parentId: string | null) => Promise<void>;
  onClose: () => void;
}

export default function CategoryForm({ category, categories, onSubmit, onClose }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(category?.name || '');
  const [parentId, setParentId] = useState<string>(category?.parent_id || '');

  const parentCategories = categories.filter(c => !c.parent_id && c.id !== category?.id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(name.trim(), parentId || null);
      toast.success(category ? 'Category updated' : 'Category added');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
          <h2 className="text-xl font-semibold text-[#d4af37]">
            {category ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                placeholder="e.g. Desserts, Coffee, Pastries"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Parent Category (Optional)</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors appearance-none"
              >
                <option value="">None (Main Category)</option>
                {parentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#3a3a3a]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-gray-400 hover:bg-[#2a2a2a] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-[#d4af37] hover:bg-[#c4a030] text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#d4af37]/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {category ? 'Update Category' : 'Add Category'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
