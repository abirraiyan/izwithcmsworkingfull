import { Edit, Trash2, MapPin, Tag } from "lucide-react";
import { motion } from "motion/react";
import { Location } from "../../types";
import { getImageUrl } from "../../lib/image";

import { Key } from "react";

interface LocationCardProps {
  key?: Key;
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (id: string) => void | Promise<void>;
}

export default function LocationCard({ location, onEdit, onDelete }: LocationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="group relative bg-[#1a1a1a]/50 backdrop-blur-md border border-[#3a3a3a] rounded-[2rem] overflow-hidden hover:border-[#d4af37]/50 transition-all duration-500"
    >
      {/* Image Section */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={getImageUrl(location.cover_image, "gallery-media")}
          alt={location.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => (e.currentTarget.src = "/placeholder.jpg")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] to-transparent opacity-60" />
        
        {/* Actions Overlay */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => onEdit(location)}
            className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-[#d4af37] hover:text-black transition-all"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(location.id)}
            className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-red-500 transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <h3 className="font-serif text-2xl font-bold text-white mb-2 group-hover:text-[#d4af37] transition-colors line-clamp-1">
          {location.name}
        </h3>
        
        <div className="flex items-start gap-2 text-gray-400 text-sm mb-4">
          <MapPin size={16} className="shrink-0 mt-0.5 text-[#d4af37]" />
          <p className="line-clamp-2">{location.address}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {location.location_tags && location.location_tags.length > 0 ? (
            location.location_tags.map((tag) => (
              <span
                key={tag.id}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-300"
              >
                <Tag size={10} className="text-[#d4af37]" />
                {tag.label}
              </span>
            ))
          ) : (
            <span className="text-[10px] text-gray-600 italic uppercase tracking-widest">No tags</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
