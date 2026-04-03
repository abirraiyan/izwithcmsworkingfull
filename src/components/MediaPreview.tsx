import { Play } from 'lucide-react';
import { getImageUrl } from '../lib/supabase';

interface MediaPreviewProps {
  url: string;
  type: 'image' | 'video';
  className?: string;
  showPlayIcon?: boolean;
}

export default function MediaPreview({ url, type, className = '', showPlayIcon = false }: MediaPreviewProps) {
  if (type === 'video') {
    return (
      <div className={`relative ${className}`}>
        <video
          src={url}
          className="w-full h-full object-cover"
          muted
          playsInline
          onMouseOver={(e) => e.currentTarget.play()}
          onMouseOut={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={getImageUrl(url, "gallery-media")}
      alt="Gallery item"
      className={`w-full h-full object-cover ${className}`}
      referrerPolicy="no-referrer"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
      }}
    />
  );
}
