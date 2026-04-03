import { Edit, Trash2 } from "lucide-react";

interface MenuTableProps {
  items: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onToggleAvailable: (id: number, currentStatus: boolean) => void;
}

export default function MenuTable({ items, onEdit, onDelete, onToggleAvailable }: MenuTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-charcoal/5 text-charcoal/60 text-sm uppercase tracking-widest border-b border-charcoal/10">
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Availability</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-charcoal/10 hover:bg-charcoal/5 transition-colors">
                <td className="p-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?q=80&w=800&auto=format&fit=crop";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 bg-charcoal/5 rounded-lg flex items-center justify-center text-xs text-charcoal/30 font-serif italic">
                      No Img
                    </div>
                  )}
                </td>
                <td className="p-4 font-serif text-lg text-charcoal">{item.name}</td>
                <td className="p-4 text-charcoal/60">{item.category}</td>
                <td className="p-4 font-mono text-charcoal">৳{item.price}</td>
                <td className="p-4">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={item.available}
                        onChange={() => onToggleAvailable(item.id, item.available)}
                      />
                      <div className={`block w-14 h-8 rounded-full transition-colors ${item.available ? 'bg-mocha' : 'bg-charcoal/20'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${item.available ? 'transform translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-charcoal/80">
                      {item.available ? "Available" : "Not Available"}
                    </div>
                  </label>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 text-charcoal/60 hover:text-mocha transition-colors"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-charcoal/60 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
