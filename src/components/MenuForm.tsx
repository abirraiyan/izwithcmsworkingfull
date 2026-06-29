import { useState, useEffect, FormEvent, Fragment } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Category, MenuItem } from '../types';
import ImageUpload from './ImageUpload';
import toast from 'react-hot-toast';

interface MenuFormProps {
  item?: MenuItem | null;
  categories: Category[];
  onSubmit: (data: any) => Promise<void>;
  onClose: () => void;
}

export default function MenuForm({ item, categories, onSubmit, onClose }: MenuFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    category_id: item?.category_id || (categories.length > 0 ? categories[0].id : ''),
    image_url: item?.image_url || '',
    is_available: item?.is_available ?? true,
  });

  const [sizes, setSizes] = useState<{ name: string; price: string }[]>(
    item?.variants && item.variants.length > 0
      ? item.variants.map(v => ({ name: v.name, price: v.price.toString() }))
      : [{ name: '', price: '' }]
  );

  // Update category_id if categories load later
  useEffect(() => {
    if (!formData.category_id && categories.length > 0) {
      setFormData(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories, formData.category_id]);

  const addSize = () => {
    setSizes([...sizes, { name: '', price: '' }]);
  };

  const removeSize = (index: number) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    } else {
      setSizes([{ name: '', price: '' }]);
    }
  };

  const updateSize = (index: number, field: 'name' | 'price', value: string) => {
    const updated = [...sizes];
    updated[index][field] = value;
    setSizes(updated);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const validSizes = sizes.filter(s => s.name && s.price);
    
    if (!formData.name || !formData.category_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (validSizes.length === 0) {
      toast.error('Please add at least one size with a price');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({ ...formData, sizes: validSizes });
      toast.success(item ? 'Item updated' : 'Item added');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Error saving item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-[#1a1a1a] border border-[#3a3a3a] rounded-none sm:rounded-2xl w-full h-full sm:h-auto sm:max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#3a3a3a]">
          <h2 className="text-xl font-semibold text-[#d4af37]">
            {item ? 'Edit Menu Item' : 'Add New Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 sm:max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Item Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  placeholder="e.g. Classic Brownie"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {categories.filter(c => !c.parent_id).map((parent) => (
                    <Fragment key={parent.id}>
                      <option value={parent.id}>
                        {parent.name}
                      </option>
                      {categories
                        .filter(child => child.parent_id === parent.id)
                        .map(child => (
                          <option key={child.id} value={child.id}>
                            &nbsp;&nbsp;↳ {child.name}
                          </option>
                        ))
                      }
                    </Fragment>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={formData.is_available}
                  onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  className="w-5 h-5 rounded border-[#3a3a3a] bg-[#2a2a2a] text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0 transition-colors"
                />
                <label htmlFor="is_available" className="text-sm font-medium text-gray-400 cursor-pointer">
                  Item is available on menu
                </label>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-400">Sizes & Prices</label>
                <div className="space-y-2">
                  {sizes.map((size, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Size (e.g. Single)"
                        value={size.name}
                        onChange={(e) => updateSize(index, 'name', e.target.value)}
                        className="flex-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                        required
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={size.price}
                        onChange={(e) => updateSize(index, 'price', e.target.value)}
                        className="w-24 bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addSize}
                  className="flex items-center gap-2 text-sm text-[#d4af37] hover:text-[#c4a030] transition-colors font-medium"
                >
                  <Plus size={16} />
                  Add Size
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <ImageUpload
                currentUrl={formData.image_url}
                onUpload={(url) => setFormData({ ...formData, image_url: url })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#d4af37] transition-colors h-32 resize-none"
              placeholder="Describe this delicious item..."
            />
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
              {item ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

