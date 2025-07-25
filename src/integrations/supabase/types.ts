export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string | null
          caregiver_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          patient_id: string
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_type?: string | null
          caregiver_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id: string
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string | null
          caregiver_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          patient_id?: string
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      caregiver_assessments: {
        Row: {
          assessed_by: string
          assessment_date: string
          assessment_type: string
          assessor_name: string
          caregiver_id: string
          created_at: string
          description: string | null
          id: string
          max_score: number | null
          next_assessment_date: string | null
          notes: string | null
          recommendations: string | null
          score: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assessed_by: string
          assessment_date?: string
          assessment_type: string
          assessor_name: string
          caregiver_id: string
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          recommendations?: string | null
          score?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assessed_by?: string
          assessment_date?: string
          assessment_type?: string
          assessor_name?: string
          caregiver_id?: string
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          recommendations?: string | null
          score?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      caregivers: {
        Row: {
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_image_url: string | null
          role: string
          shift: string | null
          specialization: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          role: string
          shift?: string | null
          specialization?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          role?: string
          shift?: string | null
          specialization?: string | null
          status?: string | null
        }
        Relationships: []
      }
      medical_records: {
        Row: {
          attachments: Json | null
          created_at: string
          description: string | null
          id: string
          is_confidential: boolean | null
          patient_id: string
          record_type: string
          recorded_by: string | null
          recorded_date: string | null
          title: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_confidential?: boolean | null
          patient_id: string
          record_type: string
          recorded_by?: string | null
          recorded_date?: string | null
          title: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_confidential?: boolean | null
          patient_id?: string
          record_type?: string
          recorded_by?: string | null
          recorded_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_allergies: {
        Row: {
          allergy_name: string
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          reaction: string | null
          severity: string | null
        }
        Insert: {
          allergy_name: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          reaction?: string | null
          severity?: string | null
        }
        Update: {
          allergy_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          reaction?: string | null
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_allergies_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_assessments: {
        Row: {
          assessed_by: string
          assessment_date: string
          assessment_type: string
          assessor_name: string
          created_at: string
          description: string | null
          id: string
          max_score: number | null
          next_assessment_date: string | null
          notes: string | null
          patient_id: string
          recommendations: string | null
          score: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assessed_by: string
          assessment_date?: string
          assessment_type: string
          assessor_name: string
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          patient_id: string
          recommendations?: string | null
          score?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assessed_by?: string
          assessment_date?: string
          assessment_type?: string
          assessor_name?: string
          created_at?: string
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          patient_id?: string
          recommendations?: string | null
          score?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      patient_caregivers: {
        Row: {
          assignment_date: string | null
          caregiver_id: string
          created_at: string
          id: string
          is_primary: boolean | null
          notes: string | null
          patient_id: string
        }
        Insert: {
          assignment_date?: string | null
          caregiver_id: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          patient_id: string
        }
        Update: {
          assignment_date?: string | null
          caregiver_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean | null
          notes?: string | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_caregivers_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_caregivers_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          address: string | null
          admission_date: string | null
          care_level: string | null
          created_at: string
          date_of_birth: string
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          phone: string | null
          profile_image_url: string | null
          room_number: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          care_level?: string | null
          created_at?: string
          date_of_birth: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          room_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          care_level?: string | null
          created_at?: string
          date_of_birth?: string
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          room_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
