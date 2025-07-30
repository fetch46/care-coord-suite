import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SearchResult {
  id: string;
  type: 'patient' | 'staff' | 'appointment';
  title: string;
  subtitle: string;
  url: string;
}

export function useGlobalSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (searchTerm.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const performSearch = async () => {
    if (searchTerm.length < 2) return;

    setLoading(true);
    try {
      const searchResults: SearchResult[] = [];

      // Search patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('id, first_name, last_name, room_number')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`)
        .limit(5);

      if (!patientsError && patients) {
        patients.forEach(patient => {
          searchResults.push({
            id: patient.id,
            type: 'patient',
            title: `${patient.first_name} ${patient.last_name}`,
            subtitle: patient.room_number ? `Room ${patient.room_number}` : 'No room assigned',
            url: `/patients/${patient.id}`
          });
        });
      }

      // Search staff
      const { data: staff, error: staffError } = await supabase
        .from('staff')
        .select('id, first_name, last_name, role')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,role.ilike.%${searchTerm}%`)
        .limit(5);

      if (!staffError && staff) {
        staff.forEach(member => {
          searchResults.push({
            id: member.id,
            type: 'staff',
            title: `${member.first_name} ${member.last_name}`,
            subtitle: member.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            url: `/staff/${member.id}`
          });
        });
      }

      // Search appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id, 
          title, 
          appointment_date,
          patients!inner(first_name, last_name)
        `)
        .or(`title.ilike.%${searchTerm}%`)
        .limit(5);

      if (!appointmentsError && appointments) {
        appointments.forEach(appointment => {
          const patient = appointment.patients as any;
          searchResults.push({
            id: appointment.id,
            type: 'appointment',
            title: appointment.title,
            subtitle: `${patient.first_name} ${patient.last_name} - ${new Date(appointment.appointment_date).toLocaleDateString()}`,
            url: `/schedule/${appointment.id}`
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const selectResult = (result: SearchResult) => {
    navigate(result.url);
    setSearchTerm("");
    setResults([]);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    selectResult,
    clearSearch
  };
}