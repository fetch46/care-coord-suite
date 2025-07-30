import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
}

export function useUserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name, email, phone')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const getDisplayName = () => {
    if (!profile) return user?.email || 'User';
    
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    } else {
      return user?.email || 'User';
    }
  };

  return { profile, loading, getDisplayName };
}