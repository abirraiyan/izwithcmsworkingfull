import React from 'react';
import { useGetToKnowUs } from '../../hooks/useGetToKnowUs';
import GetToKnowUsEditor from '../../components/admin/GetToKnowUsEditor';
import { Loader2 } from 'lucide-react';

export default function AdminGetToKnowUs() {
  const { content, loading, refresh } = useGetToKnowUs();

  if (loading || !content) {
    return (
      <div className="flex-1 h-full flex items-center justify-center bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin" />
          <p className="text-gray-400 font-medium">Loading Get To Know Us content...</p>
        </div>
      </div>
    );
  }

  return <GetToKnowUsEditor initialContent={content} onRefresh={refresh} />;
}
