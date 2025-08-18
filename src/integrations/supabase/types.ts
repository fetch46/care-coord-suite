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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
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
          care_level: string | null
          created_at: string
          created_by: string | null
          discharge_date: string | null
          discharge_reason: string | null
          emergency_contact_notified: boolean | null
          estimated_length_of_stay: number | null
          id: string
          insurance_authorization: string | null
          patient_id: string
          room_id: string
          special_requirements: string | null
          updated_at: string
        }
        Insert: {
          admission_date?: string
          admission_notes?: string | null
          admission_status?: string | null
          admission_type?: string | null
          attending_physician?: string | null
          care_level?: string | null
          created_at?: string
          created_by?: string | null
          discharge_date?: string | null
          discharge_reason?: string | null
          emergency_contact_notified?: boolean | null
          estimated_length_of_stay?: number | null
          id?: string
          insurance_authorization?: string | null
          patient_id: string
          room_id: string
          special_requirements?: string | null
          updated_at?: string
        }
        Update: {
          admission_date?: string
          admission_notes?: string | null
          admission_status?: string | null
          admission_type?: string | null
          attending_physician?: string | null
          care_level?: string | null
          created_at?: string
          created_by?: string | null
          discharge_date?: string | null
          discharge_reason?: string | null
          emergency_contact_notified?: boolean | null
          estimated_length_of_stay?: number | null
          id?: string
          insurance_authorization?: string | null
          patient_id?: string
          room_id?: string
          special_requirements?: string | null
          updated_at?: string
        }
        Relationships: []
      }
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
      assessment_reports: {
        Row: {
          assessment_date: string | null
          assessment_id: string
          assessment_type: string
          assessor_name: string | null
          created_at: string
          generated_at: string
          generated_by: string
          id: string
          patient_name: string | null
          report_data: Json | null
          report_title: string
        }
        Insert: {
          assessment_date?: string | null
          assessment_id: string
          assessment_type: string
          assessor_name?: string | null
          created_at?: string
          generated_at?: string
          generated_by: string
          id?: string
          patient_name?: string | null
          report_data?: Json | null
          report_title: string
        }
        Update: {
          assessment_date?: string | null
          assessment_id?: string
          assessment_type?: string
          assessor_name?: string | null
          created_at?: string
          generated_at?: string
          generated_by?: string
          id?: string
          patient_name?: string | null
          report_data?: Json | null
          report_title?: string
        }
        Relationships: []
      }
      assessment_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      availabilities: {
        Row: {
          created_at: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string | null
          staff_id: string
          start_time: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          staff_id: string
          start_time: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string | null
          staff_id?: string
          start_time?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "availabilities_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "availabilities_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      billing_accounts: {
        Row: {
          account_number: string
          billing_address: string | null
          billing_contact_email: string | null
          billing_contact_name: string | null
          billing_contact_phone: string | null
          created_at: string
          credit_limit: number | null
          current_balance: number | null
          id: string
          insurance_primary: string | null
          insurance_secondary: string | null
          patient_id: string | null
          payment_terms: number | null
          updated_at: string
        }
        Insert: {
          account_number: string
          billing_address?: string | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          created_at?: string
          credit_limit?: number | null
          current_balance?: number | null
          id?: string
          insurance_primary?: string | null
          insurance_secondary?: string | null
          patient_id?: string | null
          payment_terms?: number | null
          updated_at?: string
        }
        Update: {
          account_number?: string
          billing_address?: string | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          created_at?: string
          credit_limit?: number | null
          current_balance?: number | null
          id?: string
          insurance_primary?: string | null
          insurance_secondary?: string | null
          patient_id?: string | null
          payment_terms?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "billing_accounts_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      business_locations: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          organization_id?: string
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
      cms_content: {
        Row: {
          content_key: string
          content_type: string
          content_value: Json
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          content_key: string
          content_type?: string
          content_value?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          content_key?: string
          content_type?: string
          content_value?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      communication_gateways: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          provider: string
          type: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          type: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          organization_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          organization_name?: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          organization_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comprehensive_patient_assessments: {
        Row: {
          ambulating_aid: string | null
          assessment_date: string
          assessment_type: string
          assessor_name: string
          bathing_level: string | null
          behaviors: string[] | null
          blood_pressure: string | null
          bowel_incontinence_frequency: string | null
          bowels_frequency: string | null
          bp_pulse_normal: boolean | null
          caregiver_names: string | null
          catheter: boolean | null
          cognitive_functioning: string | null
          created_at: string
          dressing_level: string | null
          eating_drinking_level: string | null
          edema: string[] | null
          extremities: string[] | null
          fluid_amount: string | null
          fluid_intake: string | null
          gastrointestinal_issues: string[] | null
          general_physical_condition: string | null
          genitourinary_issues: string[] | null
          health_maintenance_needs: string[] | null
          hearing: string | null
          id: string
          medication_administration: string | null
          medications: Json | null
          mental_health_issues: string[] | null
          mobility: string | null
          movements: string | null
          musculoskeletal_issues: string[] | null
          nurse_visit_activities: string[] | null
          nurse_visit_type: string | null
          ostomy_bowel_elimination: boolean | null
          other_cardiovascular: string | null
          other_diet_details: string | null
          other_gastrointestinal: string | null
          other_genitourinary: string | null
          other_health_needs_notes: string | null
          other_medication_management: string | null
          other_musculoskeletal: string | null
          other_physical_condition: string | null
          other_respiratory_findings: string | null
          pain_affects_life: boolean | null
          pain_cause: string | null
          pain_frequency: string | null
          pain_gastrointestinal: string | null
          pain_intensity: string | null
          pain_sites: string | null
          pain_treatment: string | null
          participant_guardian_date: string | null
          participant_guardian_name: string | null
          participant_guardian_signature: string | null
          patient_id: string
          personal_hygiene_level: string | null
          pressure_ulcers_stage1: string | null
          pressure_ulcers_stage2: string | null
          pressure_ulcers_stage3: string | null
          pressure_ulcers_stage4: string | null
          psychological_counseling: string | null
          pulse: number | null
          pupils: string | null
          recent_changes: string | null
          respiration: number | null
          respiratory_findings: string[] | null
          respiratory_treatments: string[] | null
          rhythm: string | null
          rn_date: string | null
          rn_name: string | null
          rn_signature: string | null
          selected_diets: string[] | null
          shortness_of_breath: string | null
          skin_colors: string[] | null
          skin_intact: string | null
          speech_issues: string[] | null
          status: string | null
          surgical_wounds: string | null
          swallowing_issues: string | null
          temperature: number | null
          toileting_incontinent_bladder: boolean | null
          toileting_incontinent_bowel: boolean | null
          toileting_level: string | null
          transfer_aid: string | null
          ulcer_locations: string | null
          updated_at: string
          urine_frequency: string | null
          uti_treated: boolean | null
          vision: string | null
          weight: number | null
        }
        Insert: {
          ambulating_aid?: string | null
          assessment_date: string
          assessment_type: string
          assessor_name: string
          bathing_level?: string | null
          behaviors?: string[] | null
          blood_pressure?: string | null
          bowel_incontinence_frequency?: string | null
          bowels_frequency?: string | null
          bp_pulse_normal?: boolean | null
          caregiver_names?: string | null
          catheter?: boolean | null
          cognitive_functioning?: string | null
          created_at?: string
          dressing_level?: string | null
          eating_drinking_level?: string | null
          edema?: string[] | null
          extremities?: string[] | null
          fluid_amount?: string | null
          fluid_intake?: string | null
          gastrointestinal_issues?: string[] | null
          general_physical_condition?: string | null
          genitourinary_issues?: string[] | null
          health_maintenance_needs?: string[] | null
          hearing?: string | null
          id?: string
          medication_administration?: string | null
          medications?: Json | null
          mental_health_issues?: string[] | null
          mobility?: string | null
          movements?: string | null
          musculoskeletal_issues?: string[] | null
          nurse_visit_activities?: string[] | null
          nurse_visit_type?: string | null
          ostomy_bowel_elimination?: boolean | null
          other_cardiovascular?: string | null
          other_diet_details?: string | null
          other_gastrointestinal?: string | null
          other_genitourinary?: string | null
          other_health_needs_notes?: string | null
          other_medication_management?: string | null
          other_musculoskeletal?: string | null
          other_physical_condition?: string | null
          other_respiratory_findings?: string | null
          pain_affects_life?: boolean | null
          pain_cause?: string | null
          pain_frequency?: string | null
          pain_gastrointestinal?: string | null
          pain_intensity?: string | null
          pain_sites?: string | null
          pain_treatment?: string | null
          participant_guardian_date?: string | null
          participant_guardian_name?: string | null
          participant_guardian_signature?: string | null
          patient_id: string
          personal_hygiene_level?: string | null
          pressure_ulcers_stage1?: string | null
          pressure_ulcers_stage2?: string | null
          pressure_ulcers_stage3?: string | null
          pressure_ulcers_stage4?: string | null
          psychological_counseling?: string | null
          pulse?: number | null
          pupils?: string | null
          recent_changes?: string | null
          respiration?: number | null
          respiratory_findings?: string[] | null
          respiratory_treatments?: string[] | null
          rhythm?: string | null
          rn_date?: string | null
          rn_name?: string | null
          rn_signature?: string | null
          selected_diets?: string[] | null
          shortness_of_breath?: string | null
          skin_colors?: string[] | null
          skin_intact?: string | null
          speech_issues?: string[] | null
          status?: string | null
          surgical_wounds?: string | null
          swallowing_issues?: string | null
          temperature?: number | null
          toileting_incontinent_bladder?: boolean | null
          toileting_incontinent_bowel?: boolean | null
          toileting_level?: string | null
          transfer_aid?: string | null
          ulcer_locations?: string | null
          updated_at?: string
          urine_frequency?: string | null
          uti_treated?: boolean | null
          vision?: string | null
          weight?: number | null
        }
        Update: {
          ambulating_aid?: string | null
          assessment_date?: string
          assessment_type?: string
          assessor_name?: string
          bathing_level?: string | null
          behaviors?: string[] | null
          blood_pressure?: string | null
          bowel_incontinence_frequency?: string | null
          bowels_frequency?: string | null
          bp_pulse_normal?: boolean | null
          caregiver_names?: string | null
          catheter?: boolean | null
          cognitive_functioning?: string | null
          created_at?: string
          dressing_level?: string | null
          eating_drinking_level?: string | null
          edema?: string[] | null
          extremities?: string[] | null
          fluid_amount?: string | null
          fluid_intake?: string | null
          gastrointestinal_issues?: string[] | null
          general_physical_condition?: string | null
          genitourinary_issues?: string[] | null
          health_maintenance_needs?: string[] | null
          hearing?: string | null
          id?: string
          medication_administration?: string | null
          medications?: Json | null
          mental_health_issues?: string[] | null
          mobility?: string | null
          movements?: string | null
          musculoskeletal_issues?: string[] | null
          nurse_visit_activities?: string[] | null
          nurse_visit_type?: string | null
          ostomy_bowel_elimination?: boolean | null
          other_cardiovascular?: string | null
          other_diet_details?: string | null
          other_gastrointestinal?: string | null
          other_genitourinary?: string | null
          other_health_needs_notes?: string | null
          other_medication_management?: string | null
          other_musculoskeletal?: string | null
          other_physical_condition?: string | null
          other_respiratory_findings?: string | null
          pain_affects_life?: boolean | null
          pain_cause?: string | null
          pain_frequency?: string | null
          pain_gastrointestinal?: string | null
          pain_intensity?: string | null
          pain_sites?: string | null
          pain_treatment?: string | null
          participant_guardian_date?: string | null
          participant_guardian_name?: string | null
          participant_guardian_signature?: string | null
          patient_id?: string
          personal_hygiene_level?: string | null
          pressure_ulcers_stage1?: string | null
          pressure_ulcers_stage2?: string | null
          pressure_ulcers_stage3?: string | null
          pressure_ulcers_stage4?: string | null
          psychological_counseling?: string | null
          pulse?: number | null
          pupils?: string | null
          recent_changes?: string | null
          respiration?: number | null
          respiratory_findings?: string[] | null
          respiratory_treatments?: string[] | null
          rhythm?: string | null
          rn_date?: string | null
          rn_name?: string | null
          rn_signature?: string | null
          selected_diets?: string[] | null
          shortness_of_breath?: string | null
          skin_colors?: string[] | null
          skin_intact?: string | null
          speech_issues?: string[] | null
          status?: string | null
          surgical_wounds?: string | null
          swallowing_issues?: string | null
          temperature?: number | null
          toileting_incontinent_bladder?: boolean | null
          toileting_incontinent_bowel?: boolean | null
          toileting_level?: string | null
          transfer_aid?: string | null
          ulcer_locations?: string | null
          updated_at?: string
          urine_frequency?: string | null
          uti_treated?: boolean | null
          vision?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      financial_settings: {
        Row: {
          base_currency: string
          created_at: string
          id: string
          payment_methods: Json | null
          tax_rate: number | null
          updated_at: string
        }
        Insert: {
          base_currency?: string
          created_at?: string
          id?: string
          payment_methods?: Json | null
          tax_rate?: number | null
          updated_at?: string
        }
        Update: {
          base_currency?: string
          created_at?: string
          id?: string
          payment_methods?: Json | null
          tax_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      financial_transactions: {
        Row: {
          account_code: string | null
          amount: number
          category: string
          created_at: string
          created_by: string | null
          description: string
          id: string
          reference_id: string | null
          reference_type: string | null
          transaction_date: string
          transaction_number: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          account_code?: string | null
          amount: number
          category: string
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_number: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          account_code?: string | null
          amount?: number
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          transaction_date?: string
          transaction_number?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          cost_price: number | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          organization_id: string | null
          reorder_point: number
          selling_price: number | null
          sku: string | null
          type: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          organization_id?: string | null
          reorder_point?: number
          selling_price?: number | null
          sku?: string | null
          type?: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cost_price?: number | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          organization_id?: string | null
          reorder_point?: number
          selling_price?: number | null
          sku?: string | null
          type?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory_levels: {
        Row: {
          created_at: string
          id: string
          item_id: string
          location_id: string | null
          quantity: number
          updated_at: string
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          location_id?: string | null
          quantity?: number
          updated_at?: string
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          location_id?: string | null
          quantity?: number
          updated_at?: string
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_levels_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          created_at: string
          description: string
          id: string
          invoice_id: string | null
          quantity: number
          service_date: string | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          service_date?: string | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          service_date?: string | null
          total_price?: number
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
          created_at: string
          created_by: string | null
          due_date: string
          id: string
          invoice_date: string
          invoice_number: string
          notes: string | null
          patient_id: string | null
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          due_date: string
          id?: string
          invoice_date?: string
          invoice_number: string
          notes?: string | null
          patient_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          due_date?: string
          id?: string
          invoice_date?: string
          invoice_number?: string
          notes?: string | null
          patient_id?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
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
          created_at: string
          ended_at: string | null
          id: string
          is_active: boolean
          organization_id: string | null
          session_token: string
          started_at: string
          super_admin_id: string
          target_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string | null
          session_token: string
          started_at?: string
          super_admin_id: string
          target_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string | null
          session_token?: string
          started_at?: string
          super_admin_id?: string
          target_user_id?: string
          updated_at?: string
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
      modules: {
        Row: {
          category: string | null
          created_at: string
          dependencies: Json | null
          description: string | null
          display_name: string
          id: string
          is_enabled: boolean | null
          module_key: string
          name: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          dependencies?: Json | null
          description?: string | null
          display_name: string
          id?: string
          is_enabled?: boolean | null
          module_key: string
          name: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          dependencies?: Json | null
          description?: string | null
          display_name?: string
          id?: string
          is_enabled?: boolean | null
          module_key?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notification_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message_template: string
          recipients: Json
          title_template: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_template: string
          recipients?: Json
          title_template: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_template?: string
          recipients?: Json
          title_template?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          notification_type: string | null
          tenant_id: string | null
          title: string
          type: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          notification_type?: string | null
          tenant_id?: string | null
          title: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          notification_type?: string | null
          tenant_id?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_package_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          organization_id: string
          package_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          organization_id: string
          package_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          organization_id?: string
          package_id?: string
          updated_at?: string
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
          billing_type: string
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_popular: boolean | null
          name: string
          price: number
          storage_gb: number | null
          updated_at: string
          user_limit: number | null
        }
        Insert: {
          billing_type?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name: string
          price?: number
          storage_gb?: number | null
          updated_at?: string
          user_limit?: number | null
        }
        Update: {
          billing_type?: string
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_popular?: boolean | null
          name?: string
          price?: number
          storage_gb?: number | null
          updated_at?: string
          user_limit?: number | null
        }
        Relationships: []
      }
      organization_profiles: {
        Row: {
          billing_address: string | null
          billing_contact_email: string | null
          billing_contact_name: string | null
          billing_contact_phone: string | null
          business_address: string | null
          business_email: string | null
          business_phone: string | null
          created_at: string
          id: string
          license_number: string | null
          organization_id: string
          settings: Json | null
          tax_id: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          billing_address?: string | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          business_address?: string | null
          business_email?: string | null
          business_phone?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          organization_id: string
          settings?: Json | null
          tax_id?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          billing_address?: string | null
          billing_contact_email?: string | null
          billing_contact_name?: string | null
          billing_contact_phone?: string | null
          business_address?: string | null
          business_email?: string | null
          business_phone?: string | null
          created_at?: string
          id?: string
          license_number?: string | null
          organization_id?: string
          settings?: Json | null
          tax_id?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_profiles_tenant_id_fkey"
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
          created_at: string
          id: string
          invited_at: string
          invited_by: string | null
          is_confirmed: boolean
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string
          invited_by?: string | null
          is_confirmed?: boolean
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          invited_at?: string
          invited_by?: string | null
          is_confirmed?: boolean
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
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
          admin_email: string
          admin_user_id: string | null
          company_name: string
          created_at: string
          description: string | null
          domain: string | null
          id: string
          logo_url: string | null
          max_patients: number | null
          max_users: number | null
          settings: Json | null
          status: string
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          admin_email: string
          admin_user_id?: string | null
          company_name: string
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          max_patients?: number | null
          max_users?: number | null
          settings?: Json | null
          status?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          admin_email?: string
          admin_user_id?: string | null
          company_name?: string
          created_at?: string
          description?: string | null
          domain?: string | null
          id?: string
          logo_url?: string | null
          max_patients?: number | null
          max_users?: number | null
          settings?: Json | null
          status?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          billing_type: string | null
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          includes_services: Json | null
          is_active: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          billing_type?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          includes_services?: Json | null
          is_active?: boolean | null
          name: string
          price?: number
          updated_at?: string
        }
        Update: {
          billing_type?: string | null
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          includes_services?: Json | null
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          created_by: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          token: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      patient_emergency_contacts: {
        Row: {
          address: string | null
          cell_phone: string | null
          created_at: string
          home_phone: string | null
          id: string
          is_primary: boolean | null
          name: string
          patient_id: string
          relationship: string | null
          updated_at: string
          work_phone: string | null
        }
        Insert: {
          address?: string | null
          cell_phone?: string | null
          created_at?: string
          home_phone?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          patient_id: string
          relationship?: string | null
          updated_at?: string
          work_phone?: string | null
        }
        Update: {
          address?: string | null
          cell_phone?: string | null
          created_at?: string
          home_phone?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          patient_id?: string
          relationship?: string | null
          updated_at?: string
          work_phone?: string | null
        }
        Relationships: []
      }
      patient_insurance: {
        Row: {
          company: string | null
          created_at: string
          group_number: string | null
          id: string
          medicaid_number: string | null
          member_number: string | null
          patient_id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          group_number?: string | null
          id?: string
          medicaid_number?: string | null
          member_number?: string | null
          patient_id: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          group_number?: string | null
          id?: string
          medicaid_number?: string | null
          member_number?: string | null
          patient_id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_packages: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          package_id: string
          patient_id: string
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          package_id: string
          patient_id: string
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          package_id?: string
          patient_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_physicians: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          npi_number: string | null
          patient_id: string
          physician_address: string | null
          physician_name: string
          physician_phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          npi_number?: string | null
          patient_id: string
          physician_address?: string | null
          physician_name: string
          physician_phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          npi_number?: string | null
          patient_id?: string
          physician_address?: string | null
          physician_name?: string
          physician_phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      patient_surgeries: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          patient_id: string
          surgery_date: string | null
          surgery_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          surgery_date?: string | null
          surgery_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          surgery_date?: string | null
          surgery_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          address: string | null
          admission_date: string | null
          care_level: string | null
          created_at: string
          date_of_birth: string
          date_of_discharge: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          gender: string | null
          id: string
          last_name: string
          middle_name: string | null
          phone: string | null
          plan_of_care: string | null
          primary_diagnosis: string | null
          profile_image_url: string | null
          race: string | null
          referral_source: string | null
          registration_status: string | null
          room_number: string | null
          secondary_diagnosis: string | null
          sex: string | null
          ssn: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          admission_date?: string | null
          care_level?: string | null
          created_at?: string
          date_of_birth: string
          date_of_discharge?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          middle_name?: string | null
          phone?: string | null
          plan_of_care?: string | null
          primary_diagnosis?: string | null
          profile_image_url?: string | null
          race?: string | null
          referral_source?: string | null
          registration_status?: string | null
          room_number?: string | null
          secondary_diagnosis?: string | null
          sex?: string | null
          ssn?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          admission_date?: string | null
          care_level?: string | null
          created_at?: string
          date_of_birth?: string
          date_of_discharge?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          middle_name?: string | null
          phone?: string | null
          plan_of_care?: string | null
          primary_diagnosis?: string | null
          profile_image_url?: string | null
          race?: string | null
          referral_source?: string | null
          registration_status?: string | null
          room_number?: string | null
          secondary_diagnosis?: string | null
          sex?: string | null
          ssn?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_gateways: {
        Row: {
          configuration: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          provider: string
          updated_at: string
        }
        Insert: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          provider: string
          updated_at?: string
        }
        Update: {
          configuration?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string | null
          notes: string | null
          patient_id: string | null
          payment_date: string
          payment_method: string
          payment_number: string
          processed_by: string | null
          reference_number: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          patient_id?: string | null
          payment_date?: string
          payment_method?: string
          payment_number: string
          processed_by?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          patient_id?: string | null
          payment_date?: string
          payment_method?: string
          payment_number?: string
          processed_by?: string | null
          reference_number?: string | null
          status?: string
          updated_at?: string
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
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean
          can_delete: boolean
          can_edit: boolean
          can_view: boolean
          created_at: string
          id: string
          resource: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          resource: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          can_create?: boolean
          can_delete?: boolean
          can_edit?: boolean
          can_view?: boolean
          created_at?: string
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      rooms: {
        Row: {
          capacity: number | null
          created_at: string
          id: string
          notes: string | null
          room_number: string
          room_type: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          room_number: string
          room_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          id?: string
          notes?: string | null
          room_number?: string
          room_type?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      skin_assessments: {
        Row: {
          assessed_by: string | null
          attending_physician: string | null
          body_annotations: Json | null
          created_at: string
          date: string
          general_notes: string | null
          hot_spot_assessments: Json | null
          id: string
          patient_id: string
          room_number: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assessed_by?: string | null
          attending_physician?: string | null
          body_annotations?: Json | null
          created_at?: string
          date: string
          general_notes?: string | null
          hot_spot_assessments?: Json | null
          id?: string
          patient_id: string
          room_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assessed_by?: string | null
          attending_physician?: string | null
          body_annotations?: Json | null
          created_at?: string
          date?: string
          general_notes?: string | null
          hot_spot_assessments?: Json | null
          id?: string
          patient_id?: string
          room_number?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skin_assessments_assessed_by_fkey"
            columns: ["assessed_by"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
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
          updated_at: string
          user_id: string | null
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
          updated_at?: string
          user_id?: string | null
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
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          max_patients: number | null
          max_users: number | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_patients?: number | null
          max_users?: number | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          max_patients?: number | null
          max_users?: number | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          amount: number
          billing_cycle: string
          canceled_at: string | null
          created_at: string
          currency: string | null
          ends_at: string | null
          id: string
          organization_id: string
          plan_id: string
          starts_at: string
          status: string
          stripe_subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          billing_cycle?: string
          canceled_at?: string | null
          created_at?: string
          currency?: string | null
          ends_at?: string | null
          id?: string
          organization_id: string
          plan_id: string
          starts_at?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          canceled_at?: string | null
          created_at?: string
          currency?: string | null
          ends_at?: string | null
          id?: string
          organization_id?: string
          plan_id?: string
          starts_at?: string
          status?: string
          stripe_subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
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
          created_at: string
          id: string
          industry: string | null
          notes: string | null
          plan_details: Json | null
          processed_date: string | null
          selected_plan: string | null
          signup_date: string
          status: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          admin_email: string
          admin_first_name: string
          admin_last_name: string
          admin_phone?: string | null
          company_name: string
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          plan_details?: Json | null
          processed_date?: string | null
          selected_plan?: string | null
          signup_date?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_email?: string
          admin_first_name?: string
          admin_last_name?: string
          admin_phone?: string | null
          company_name?: string
          company_size?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          notes?: string | null
          plan_details?: Json | null
          processed_date?: string | null
          selected_plan?: string | null
          signup_date?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      timesheet_approvals: {
        Row: {
          approval_date: string | null
          approver_id: string
          created_at: string
          id: string
          notes: string | null
          rejection_reason: string | null
          status: string
          timesheet_id: string
          updated_at: string
        }
        Insert: {
          approval_date?: string | null
          approver_id: string
          created_at?: string
          id?: string
          notes?: string | null
          rejection_reason?: string | null
          status?: string
          timesheet_id: string
          updated_at?: string
        }
        Update: {
          approval_date?: string | null
          approver_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          rejection_reason?: string | null
          status?: string
          timesheet_id?: string
          updated_at?: string
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
          approval_status: string | null
          break_minutes: number | null
          caregiver_id: string
          created_at: string
          employee_signature: string | null
          employee_signature_date: string | null
          home_management_tasks: Json | null
          id: string
          miles: number | null
          patient_id: string
          patient_signature: string | null
          patient_signature_date: string | null
          personal_care_tasks: Json | null
          sleep_in: boolean | null
          status: string | null
          submitted_at: string | null
          time_in: string
          time_out: string
          total_hours: number | null
          updated_at: string
          work_date: string
        }
        Insert: {
          activities_tasks?: Json | null
          additional_comments?: string | null
          approval_status?: string | null
          break_minutes?: number | null
          caregiver_id: string
          created_at?: string
          employee_signature?: string | null
          employee_signature_date?: string | null
          home_management_tasks?: Json | null
          id?: string
          miles?: number | null
          patient_id: string
          patient_signature?: string | null
          patient_signature_date?: string | null
          personal_care_tasks?: Json | null
          sleep_in?: boolean | null
          status?: string | null
          submitted_at?: string | null
          time_in: string
          time_out: string
          total_hours?: number | null
          updated_at?: string
          work_date: string
        }
        Update: {
          activities_tasks?: Json | null
          additional_comments?: string | null
          approval_status?: string | null
          break_minutes?: number | null
          caregiver_id?: string
          created_at?: string
          employee_signature?: string | null
          employee_signature_date?: string | null
          home_management_tasks?: Json | null
          id?: string
          miles?: number | null
          patient_id?: string
          patient_signature?: string | null
          patient_signature_date?: string | null
          personal_care_tasks?: Json | null
          sleep_in?: boolean | null
          status?: string | null
          submitted_at?: string | null
          time_in?: string
          time_out?: string
          total_hours?: number | null
          updated_at?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "timesheets_caregiver_id_fkey"
            columns: ["caregiver_id"]
            isOneToOne: false
            referencedRelation: "caregivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timesheets_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      approve_tenant_signup: {
        Args: { p_signup_id: string }
        Returns: Json
      }
      create_super_admin_user: {
        Args: { user_email: string; user_password: string }
        Returns: string
      }
      create_user_with_staff: {
        Args:
          | {
              p_email: string
              p_first_name: string
              p_last_name: string
              p_phone?: string
              p_role: string
            }
          | {
              p_email: string
              p_first_name: string
              p_last_name: string
              p_phone?: string
              p_role: string
              p_user_id: string
            }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      send_notification_from_template: {
        Args: { p_data?: Json; p_template_type: string; p_tenant_id?: string }
        Returns: string
      }
    }
    Enums: {
      app_role:
        | "administrator"
        | "reception"
        | "registered_nurse"
        | "caregiver"
        | "owner"
        | "admin"
        | "staff"
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
        "administrator",
        "reception",
        "registered_nurse",
        "caregiver",
        "owner",
        "admin",
        "staff",
      ],
    },
  },
} as const
