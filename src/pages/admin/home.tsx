import { useState, useEffect } from 'react';
import { getHomeContent, getHomeGallery } from '../../lib/site/getHomeContent';
import { SiteContent, GalleryItem } from '../../types';
import HomeEditor from '../../components/admin/HomeEditor';
import { Loader2 } from 'lucide-react';

export default function AdminHome() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [homeContent, homeGallery] = await Promise.all([
        getHomeContent(),
        getHomeGallery()
      ]);
      setContent(homeContent);
      setGallery(homeGallery);
    } catch (err) {
      console.error("Failed to load home cms data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !content) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <Loader2 className="animate-spin w-8 h-8 mr-3" />
        <span>Loading Home Content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#d4af37] mb-2">Website Home</h1>
          <p className="text-gray-400">Manage the content and layout of your homepage.</p>
        </div>
      </div>
      
      <HomeEditor 
        initialContent={content} 
        initialGallery={gallery} 
        onRefresh={fetchData} 
      />
    </div>
  );
}
