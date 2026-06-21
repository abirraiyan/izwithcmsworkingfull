import { useState, useEffect } from 'react';
import { getOurStoryContent } from '../../lib/site/ourStoryContent';
import { OurStoryContent } from '../../types';
import OurStoryEditor from '../../components/admin/OurStoryEditor';
import { Loader2 } from 'lucide-react';

export default function AdminOurStory() {
  const [content, setContent] = useState<OurStoryContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getOurStoryContent();
      setContent(data || {});
    } catch (err) {
      console.error("Failed to load our story cms data", err);
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
        <span>Loading Our Story Content...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-[#d4af37] mb-2">Our Story</h1>
          <p className="text-gray-400">Manage the content and layout of your Our Story page.</p>
        </div>
      </div>
      
      <OurStoryEditor 
        initialContent={content} 
        onRefresh={fetchData} 
      />
    </div>
  );
}
