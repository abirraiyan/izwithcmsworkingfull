import { useState, useEffect, useCallback } from 'react';
import { GetToKnowUsContent } from '../types/getToKnowUs';
import { getGetToKnowUsContent, updateGetToKnowUsContent } from '../lib/site/getToKnowUsContent';
import toast from 'react-hot-toast';

export function useGetToKnowUs() {
  const [content, setContent] = useState<GetToKnowUsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getGetToKnowUsContent();
      setContent(data);
    } catch (error: any) {
      console.error('Error fetching Get To Know Us content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveContent = async (newContent: GetToKnowUsContent) => {
    // Optimistic update
    const previousContent = content;
    setContent(newContent);
    setSaving(true);
    
    try {
      await updateGetToKnowUsContent(newContent);
      toast.success('Content published successfully');
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error('Failed to publish content');
      // Rollback
      setContent(previousContent);
    } finally {
      setSaving(false);
    }
  };

  return {
    content,
    loading,
    saving,
    saveContent,
    refresh: fetchContent
  };
}
