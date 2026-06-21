import { useState, useEffect } from 'react';
import { OurStoryContent } from '../types';
import { getOurStoryContent } from '../lib/site/ourStoryContent';

export const useOurStory = () => {
  const [content, setContent] = useState<OurStoryContent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await getOurStoryContent();
      setContent(data);
    } catch (err) {
      console.error("Failed to fetch our story", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  return { content, loading, refetch: fetchContent };
};
