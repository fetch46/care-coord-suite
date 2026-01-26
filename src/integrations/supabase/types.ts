export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admissions: {
        Row: {
          admission_date: string
          admission_notes: string | null
          admission_status: string | null
          admission_type: string | null
          attending_physician: string | null
          bed_number: string | null
          care_level: string | null
          created_at: string | null
          diagnosis: string | null
          discharge_date: string | null
          emergency_contact_notified: boolean | null
          estimated_length_of_stay: number | null
          id: string
          insurance_authorization: string | null
          notes: string | null
          organization_id: string | null
          patient_id: string
          room_id: string | null
          room_number: string | null
          special_requirements: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admission_date: string
          admission_notes?: string | null
          admission_status?: string | null
          admission_type?: string | null
          attending_physician?: string | null
          bed_number?: string | null
          care_level?: string | null
          created_at?: string | null
          diagnosis?: string | null
          discharge_date?: string | null
          emergency_contact_notified?: boolean | null
          estimated_length_of_stay?: number | null
          id?: string
          insurance_authorization?: string | null
          notes?: string | null
          organization_id?: string | null
          patient_id: string
          room_id?: string | null
          room_number?: string | null
          special_requirements?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admission_date?: string
          admission_notes?: string | null
          admission_status?: string | null
          admission_type?: string | null
          attending_physician?: string | null
          bed_number?: string | null
          care_level?: string | null
          created_at?: string | null
          diagnosis?: string | null
          discharge_date?: string | null
          emergency_contact_notified?: boolean | null
          estimated_length_of_stay?: number | null
          id?: string
          insurance_authorization?: string | null
          notes?: string | null
          organization_id?: string | null
          patient_id?: string
          room_id?: string | null
          room_number?: string | null
          special_requirements?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admissions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admissions_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          caregiver_id: string | null
          created_at: string | null
          description: string | null
          end_time: string | null
          id: string
          notes: string | null
          organization_id: string | null
          patient_id: string | null
          staff_id: string | null
          start_time: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          caregiver_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          patient_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          caregiver_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          notes?: string | null
          organization_id?: string | null
          patient_id?: string | null
          staff_id?: string | null
          start_time?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_reports: {
        Row: {
          assessment_date: string | null
          assessment_id: string | null
          assessment_type: string
          assessor_name: string | null
          created_at: string | null
          findings: string | null
          generated_at: string | null
          generated_by: string | null
          id: string
          patient_name: string | null
          recommendations: string | null
          report_data: Json | null
          report_title: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_id?: string | null
          assessment_type: string
          assessor_name?: string | null
          created_at?: string | null
          findings?: string | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          patient_name?: string | null
          recommendations?: string | null
          report_data?: Json | null
          report_title: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_id?: string | null
          assessment_type?: string
          assessor_name?: string | null
          created_at?: string | null
          findings?: string | null
          generated_at?: string | null
          generated_by?: string | null
          id?: string
          patient_name?: string | null
          recommendations?: string | null
          report_data?: Json | null
          report_title?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assessment_types: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      availabilities: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string | null
          id: string
          is_available: boolean | null
          staff_id: string
          start_time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          staff_id: string
          start_time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string | null
          id?: string
          is_available?: boolean | null
          staff_id?: string
          start_time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "availabilities_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      caregiver_assessments: {
        Row: {
          assessment_date: string | null
          assessment_type: string
          assessor_name: string | null
          caregiver_id: string
          created_at: string | null
          description: string | null
          id: string
          max_score: number | null
          next_assessment_date: string | null
          notes: string | null
          recommendations: string | null
          score: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_type: string
          assessor_name?: string | null
          caregiver_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          recommendations?: string | null
          score?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_type?: string
          assessor_name?: string | null
          caregiver_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          recommendations?: string | null
          score?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregiver_assessments_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      caregivers: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          organization_id: string | null
          phone: string | null
          role: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "caregivers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          content_key: string
          content_type: string
          content_value?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          logo_url: string | null
          organization_id: string | null
          organization_name: string | null
          phone: string | null
          settings: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          organization_id?: string | null
          organization_name?: string | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          organization_id?: string | null
          organization_name?: string | null
          phone?: string | null
          settings?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      comprehensive_patient_assessments: {
        Row: {
          assessment_date: string | null
          assessment_type: string
          assessor_name: string | null
          created_at: string | null
          id: string
          max_score: number | null
          notes: string | null
          patient_id: string | null
          score: number | null
          source: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_type: string
          assessor_name?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          patient_id?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_type?: string
          assessor_name?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          notes?: string | null
          patient_id?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comprehensive_patient_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      discharges: {
        Row: {
          admission_id: string | null
          created_at: string | null
          discharge_date: string
          discharge_reason: string | null
          discharge_summary: string | null
          discharged_by: string | null
          follow_up_instructions: string | null
          id: string
          patient_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admission_id?: string | null
          created_at?: string | null
          discharge_date: string
          discharge_reason?: string | null
          discharge_summary?: string | null
          discharged_by?: string | null
          follow_up_instructions?: string | null
          id?: string
          patient_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admission_id?: string | null
          created_at?: string | null
          discharge_date?: string
          discharge_reason?: string | null
          discharge_summary?: string | null
          discharged_by?: string | null
          follow_up_instructions?: string | null
          id?: string
          patient_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discharges_admission_id_fkey"
            columns: ["admission_id"]
            isOneToOne: false
            referencedRelation: "admissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discharges_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_settings: {
        Row: {
          base_currency: string | null
          created_at: string | null
          id: string
          organization_id: string | null
          payment_methods: string[] | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          base_currency?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          payment_methods?: string[] | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          base_currency?: string | null
          created_at?: string | null
          id?: string
          organization_id?: string | null
          payment_methods?: string[] | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_settings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          organization_id: string | null
          reference_id: string | null
          reference_type: string | null
          transaction_date: string
          transaction_type: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_date: string
          transaction_type: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_id?: string | null
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string
          quantity: number | null
          service_date: string | null
          total_price: number | null
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id: string
          quantity?: number | null
          service_date?: string | null
          total_price?: number | null
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number | null
          service_date?: string | null
          total_price?: number | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          notes: string | null
          organization_id: string | null
          paid_at: string | null
          patient_id: string | null
          status: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          patient_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          notes?: string | null
          organization_id?: string | null
          paid_at?: string | null
          patient_id?: string | null
          status?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      masquerade_sessions: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          is_active: boolean | null
          session_token: string
          started_at: string | null
          super_admin_id: string
          target_organization_id: string | null
          target_user_id: string
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          session_token: string
          started_at?: string | null
          super_admin_id: string
          target_organization_id?: string | null
          target_user_id: string
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          is_active?: boolean | null
          session_token?: string
          started_at?: string | null
          super_admin_id?: string
          target_organization_id?: string | null
          target_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "masquerade_sessions_target_organization_id_fkey"
            columns: ["target_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      medical_records: {
        Row: {
          content: string | null
          created_at: string | null
          description: string | null
          id: string
          is_confidential: boolean | null
          organization_id: string | null
          patient_id: string
          record_date: string | null
          record_type: string
          recorded_by: string | null
          recorded_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_confidential?: boolean | null
          organization_id?: string | null
          patient_id: string
          record_date?: string | null
          record_type: string
          recorded_by?: string | null
          recorded_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_confidential?: boolean | null
          organization_id?: string | null
          patient_id?: string
          record_date?: string | null
          record_type?: string
          recorded_by?: string | null
          recorded_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "medical_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medical_records_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: string | null
          created_at: string | null
          dependencies: string[] | null
          description: string | null
          display_name: string
          id: string
          is_enabled: boolean | null
          module_key: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          display_name: string
          id?: string
          is_enabled?: boolean | null
          module_key: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          description?: string | null
          display_name?: string
          id?: string
          is_enabled?: boolean | null
          module_key?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      organization_package_assignments: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          organization_id: string
          package_id: string
          starts_at: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id: string
          package_id: string
          starts_at?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          organization_id?: string
          package_id?: string
          starts_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_package_assignments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_package_assignments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "organization_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_packages: {
        Row: {
          billing_type: string | null
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          storage_gb: number | null
          updated_at: string | null
          user_limit: number | null
        }
        Insert: {
          billing_type?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price?: number
          storage_gb?: number | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Update: {
          billing_type?: string | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          storage_gb?: number | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Relationships: []
      }
      organization_profiles: {
        Row: {
          business_address: string | null
          company_size: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string
          industry: string | null
          logo_url: string | null
          organization_id: string | null
          social_links: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          business_address?: string | null
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          organization_id?: string | null
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          business_address?: string | null
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          organization_id?: string | null
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_users: {
        Row: {
          confirmed_at: string | null
          created_at: string | null
          id: string
          invited_at: string | null
          invited_by: string | null
          is_confirmed: boolean | null
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_confirmed?: boolean | null
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          is_confirmed?: boolean | null
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          admin_email: string | null
          admin_user_id: string | null
          city: string | null
          company_name: string
          created_at: string | null
          description: string | null
          domain: string | null
          email: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          max_patients: number | null
          max_users: number | null
          phone: string | null
          settings: Json | null
          state: string | null
          status: string | null
          storage_limit_gb: number | null
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_limit: number | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          admin_email?: string | null
          admin_user_id?: string | null
          city?: string | null
          company_name: string
          created_at?: string | null
          description?: string | null
          domain?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_patients?: number | null
          max_users?: number | null
          phone?: string | null
          settings?: Json | null
          state?: string | null
          status?: string | null
          storage_limit_gb?: number | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_limit?: number | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          admin_email?: string | null
          admin_user_id?: string | null
          city?: string | null
          company_name?: string
          created_at?: string | null
          description?: string | null
          domain?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          max_patients?: number | null
          max_users?: number | null
          phone?: string | null
          settings?: Json | null
          state?: string | null
          status?: string | null
          storage_limit_gb?: number | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_limit?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      patient_allergies: {
        Row: {
          allergy_name: string
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string
          reaction: string | null
          severity: string | null
        }
        Insert: {
          allergy_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          reaction?: string | null
          severity?: string | null
        }
        Update: {
          allergy_name?: string
          created_at?: string | null
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
          assessment_date: string | null
          assessment_type: string
          assessor_name: string | null
          created_at: string | null
          description: string | null
          id: string
          max_score: number | null
          next_assessment_date: string | null
          notes: string | null
          patient_id: string
          recommendations: string | null
          score: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessment_type: string
          assessor_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          patient_id: string
          recommendations?: string | null
          score?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessment_type?: string
          assessor_name?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          max_score?: number | null
          next_assessment_date?: string | null
          notes?: string | null
          patient_id?: string
          recommendations?: string | null
          score?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_caregivers: {
        Row: {
          assigned_at: string | null
          caregiver_id: string
          created_at: string | null
          id: string
          is_primary: boolean | null
          patient_id: string
        }
        Insert: {
          assigned_at?: string | null
          caregiver_id: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          patient_id: string
        }
        Update: {
          assigned_at?: string | null
          caregiver_id?: string
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_caregivers_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "staff"
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
      patient_emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          patient_id: string
          phone: string | null
          relationship: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          patient_id: string
          phone?: string | null
          relationship?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          patient_id?: string
          phone?: string | null
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_emergency_contacts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_insurance: {
        Row: {
          company: string | null
          created_at: string | null
          effective_date: string | null
          expiration_date: string | null
          group_number: string | null
          id: string
          is_primary: boolean | null
          medicaid_number: string | null
          member_number: string | null
          patient_id: string
          phone_number: string | null
          policy_number: string | null
          provider_name: string
          subscriber_name: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          group_number?: string | null
          id?: string
          is_primary?: boolean | null
          medicaid_number?: string | null
          member_number?: string | null
          patient_id: string
          phone_number?: string | null
          policy_number?: string | null
          provider_name: string
          subscriber_name?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          effective_date?: string | null
          expiration_date?: string | null
          group_number?: string | null
          id?: string
          is_primary?: boolean | null
          medicaid_number?: string | null
          member_number?: string | null
          patient_id?: string
          phone_number?: string | null
          policy_number?: string | null
          provider_name?: string
          subscriber_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_insurance_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_physicians: {
        Row: {
          address: string | null
          created_at: string | null
          fax: string | null
          id: string
          is_primary: boolean | null
          patient_id: string
          phone: string | null
          physician_name: string
          specialty: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          fax?: string | null
          id?: string
          is_primary?: boolean | null
          patient_id: string
          phone?: string | null
          physician_name: string
          specialty?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          fax?: string | null
          id?: string
          is_primary?: boolean | null
          patient_id?: string
          phone?: string | null
          physician_name?: string
          specialty?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_physicians_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_surgeries: {
        Row: {
          created_at: string | null
          hospital: string | null
          id: string
          notes: string | null
          patient_id: string
          surgeon: string | null
          surgery_date: string | null
          surgery_name: string
        }
        Insert: {
          created_at?: string | null
          hospital?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          surgeon?: string | null
          surgery_date?: string | null
          surgery_name: string
        }
        Update: {
          created_at?: string | null
          hospital?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          surgeon?: string | null
          surgery_date?: string | null
          surgery_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_surgeries_patient_id_fkey"
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
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          organization_id: string | null
          phone: string | null
          room_number: string | null
          state: string | null
          status: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          care_level?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          organization_id?: string | null
          phone?: string | null
          room_number?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          care_level?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          organization_id?: string | null
          phone?: string | null
          room_number?: string | null
          state?: string | null
          status?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          invoice_id: string | null
          notes: string | null
          organization_id: string | null
          patient_id: string | null
          payment_date: string | null
          payment_method: string | null
          payment_number: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          organization_id?: string | null
          patient_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_number?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          organization_id?: string | null
          patient_id?: string | null
          payment_date?: string | null
          payment_method?: string | null
          payment_number?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          created_at: string | null
          id: string
          resource: string
          role: string
          updated_at: string | null
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          resource: string
          role: string
          updated_at?: string | null
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          created_at?: string | null
          id?: string
          resource?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          building: string | null
          capacity: number | null
          created_at: string | null
          floor: string | null
          id: string
          organization_id: string | null
          room_number: string
          room_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          building?: string | null
          capacity?: number | null
          created_at?: string | null
          floor?: string | null
          id?: string
          organization_id?: string | null
          room_number: string
          room_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          building?: string | null
          capacity?: number | null
          created_at?: string | null
          floor?: string | null
          id?: string
          organization_id?: string | null
          room_number?: string
          room_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          organization_id: string | null
          patient_id: string | null
          staff_id: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          organization_id?: string | null
          patient_id?: string | null
          staff_id?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          organization_id?: string | null
          patient_id?: string | null
          staff_id?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedules_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_assessment_findings: {
        Row: {
          body_part: string
          coordinates: Json | null
          created_at: string | null
          description: string | null
          finding_type: string | null
          id: string
          severity: string | null
          skin_assessment_id: string | null
        }
        Insert: {
          body_part: string
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          finding_type?: string | null
          id?: string
          severity?: string | null
          skin_assessment_id?: string | null
        }
        Update: {
          body_part?: string
          coordinates?: Json | null
          created_at?: string | null
          description?: string | null
          finding_type?: string | null
          id?: string
          severity?: string | null
          skin_assessment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skin_assessment_findings_skin_assessment_id_fkey"
            columns: ["skin_assessment_id"]
            isOneToOne: false
            referencedRelation: "skin_assessments"
            referencedColumns: ["id"]
          },
        ]
      }
      skin_assessments: {
        Row: {
          assessment_date: string | null
          assessor_id: string | null
          body_map_data: Json | null
          created_at: string | null
          id: string
          notes: string | null
          patient_id: string
          pressure_ulcer_risk: string | null
          skin_condition: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assessment_date?: string | null
          assessor_id?: string | null
          body_map_data?: Json | null
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          pressure_ulcer_risk?: string | null
          skin_condition?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assessment_date?: string | null
          assessor_id?: string | null
          body_map_data?: Json | null
          created_at?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          pressure_ulcer_risk?: string | null
          skin_condition?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "skin_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          organization_id: string | null
          phone: string | null
          profile_image_url: string | null
          role: string | null
          shift: string | null
          specialization: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          organization_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          shift?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          organization_id?: string | null
          phone?: string | null
          profile_image_url?: string | null
          role?: string | null
          shift?: string | null
          specialization?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          billing_cycle: string | null
          created_at: string | null
          ends_at: string | null
          id: string
          organization_id: string
          package_id: string | null
          starts_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          billing_cycle?: string | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          organization_id: string
          package_id?: string | null
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          billing_cycle?: string | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          organization_id?: string
          package_id?: string | null
          starts_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "organization_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_signups: {
        Row: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          admin_phone: string | null
          company_name: string
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          selected_plan: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          admin_phone?: string | null
          company_name: string
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          selected_plan?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_email?: string
          admin_first_name?: string
          admin_last_name?: string
          admin_phone?: string | null
          company_name?: string
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          selected_plan?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      timesheet_approvals: {
        Row: {
          approval_date: string | null
          approver_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          rejection_reason: string | null
          status: string | null
          timesheet_id: string
        }
        Insert: {
          approval_date?: string | null
          approver_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          rejection_reason?: string | null
          status?: string | null
          timesheet_id: string
        }
        Update: {
          approval_date?: string | null
          approver_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          rejection_reason?: string | null
          status?: string | null
          timesheet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheet_approvals_timesheet_id_fkey"
            columns: ["timesheet_id"]
            isOneToOne: false
            referencedRelation: "timesheets"
            referencedColumns: ["id"]
          },
        ]
      }
      timesheets: {
        Row: {
          activities_tasks: Json | null
          additional_comments: string | null
          additional_notes: string | null
          approval_status: string | null
          approved_at: string | null
          approved_by: string | null
          break_minutes: number | null
          caregiver_id: string | null
          caregiver_signature: string | null
          clock_in: string | null
          clock_out: string | null
          created_at: string | null
          date: string
          employee_signature: string | null
          employee_signature_date: string | null
          home_management_tasks: Json | null
          id: string
          miles: number | null
          notes: string | null
          organization_id: string | null
          patient_id: string | null
          patient_signature: string | null
          patient_signature_date: string | null
          personal_care_tasks: Json | null
          sleep_in: boolean | null
          staff_id: string | null
          status: string | null
          submitted_at: string | null
          time_in: string | null
          time_out: string | null
          total_hours: number | null
          updated_at: string | null
          work_date: string | null
        }
        Insert: {
          activities_tasks?: Json | null
          additional_comments?: string | null
          additional_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          break_minutes?: number | null
          caregiver_id?: string | null
          caregiver_signature?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date: string
          employee_signature?: string | null
          employee_signature_date?: string | null
          home_management_tasks?: Json | null
          id?: string
          miles?: number | null
          notes?: string | null
          organization_id?: string | null
          patient_id?: string | null
          patient_signature?: string | null
          patient_signature_date?: string | null
          personal_care_tasks?: Json | null
          sleep_in?: boolean | null
          staff_id?: string | null
          status?: string | null
          submitted_at?: string | null
          time_in?: string | null
          time_out?: string | null
          total_hours?: number | null
          updated_at?: string | null
          work_date?: string | null
        }
        Update: {
          activities_tasks?: Json | null
          additional_comments?: string | null
          additional_notes?: string | null
          approval_status?: string | null
          approved_at?: string | null
          approved_by?: string | null
          break_minutes?: number | null
          caregiver_id?: string | null
          caregiver_signature?: string | null
          clock_in?: string | null
          clock_out?: string | null
          created_at?: string | null
          date?: string
          employee_signature?: string | null
          employee_signature_date?: string | null
          home_management_tasks?: Json | null
          id?: string
          miles?: number | null
          notes?: string | null
          organization_id?: string | null
          patient_id?: string | null
          patient_signature?: string | null
          patient_signature_date?: string | null
          personal_care_tasks?: Json | null
          sleep_in?: boolean | null
          staff_id?: string | null
          status?: string | null
          submitted_at?: string | null
          time_in?: string | null
          time_out?: string | null
          total_hours?: number | null
          updated_at?: string | null
          work_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "owner"
        | "admin"
        | "staff"
        | "administrator"
        | "reception"
        | "registered_nurse"
        | "caregiver"
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
    Enums: {
      app_role: [
        "owner",
        "admin",
        "staff",
        "administrator",
        "reception",
        "registered_nurse",
        "caregiver",
      ],
    },
  },
} as const
