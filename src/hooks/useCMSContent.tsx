import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CMSContent {
  content_key: string;
  content_type: string;
  content_value: any;
  is_active: boolean;
}

export function useCMSContent() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('cms_content')
          .select('content_key, content_type, content_value, is_active')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching CMS content:', error);
          return;
        }

        const contentMap: Record<string, any> = {};
        data?.forEach((item: CMSContent) => {
          contentMap[item.content_key] = item.content_value.text || item.content_value;
        });

        setContent(contentMap);
      } catch (error) {
        console.error('Error fetching CMS content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getContent = (key: string, fallback: string = '') => {
    return content[key] || fallback;
  };

  return { content, getContent, loading };
}