import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MasqueradeSession {
  id: string;
  super_admin_id: string;
  target_user_id: string;
  tenant_id?: string;
  session_token: string;
  is_active: boolean;
  started_at: string;
}

export function useMasquerade() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentMasquerade, setCurrentMasquerade] = useState<MasqueradeSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkActiveMasquerade();
  }, [user]);

  const checkActiveMasquerade = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('masquerade_sessions')
        .select('*')
        .eq('super_admin_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error checking masquerade session:', error);
        return;
      }

      setCurrentMasquerade(data);
    } catch (error) {
      console.error('Error checking masquerade session:', error);
    }
  };

  const startMasquerade = async (targetUserId: string, tenantId?: string) => {
    if (!user) return false;

    setLoading(true);
    try {
      const sessionToken = generateSessionToken();
      
      const { data, error } = await supabase
        .from('masquerade_sessions')
        .insert({
          super_admin_id: user.id,
          target_user_id: targetUserId,
          tenant_id: tenantId,
          session_token: sessionToken,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentMasquerade(data);
      
      toast({
        title: "Masquerade Started",
        description: "You are now acting as the selected user",
      });

      return true;
    } catch (error) {
      console.error('Error starting masquerade:', error);
      toast({
        title: "Error",
        description: "Failed to start masquerade session",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const endMasquerade = async () => {
    if (!currentMasquerade) return false;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('masquerade_sessions')
        .update({
          is_active: false,
          ended_at: new Date().toISOString()
        })
        .eq('id', currentMasquerade.id);

      if (error) throw error;

      setCurrentMasquerade(null);
      
      toast({
        title: "Masquerade Ended",
        description: "You are now back to your super admin account",
      });

      return true;
    } catch (error) {
      console.error('Error ending masquerade:', error);
      toast({
        title: "Error",
        description: "Failed to end masquerade session",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateSessionToken = () => {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  return {
    currentMasquerade,
    loading,
    startMasquerade,
    endMasquerade,
    isMasquerading: !!currentMasquerade
  };
}