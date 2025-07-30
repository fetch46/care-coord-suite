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
      masquerade_sessions: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          is_active: boolean
          session_token: string
          started_at: string
          super_admin_id: string
          target_user_id: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean
          session_token: string
          started_at?: string
          super_admin_id: string
          target_user_id: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          is_active?: boolean
          session_token?: string
          started_at?: string
          super_admin_id?: string
          target_user_id?: string
          tenant_id?: string | null
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
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
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
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string | null
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
          plan_id: string
          starts_at: string
          status: string
          stripe_subscription_id: string | null
          tenant_id: string
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
          plan_id: string
          starts_at?: string
          status?: string
          stripe_subscription_id?: string | null
          tenant_id: string
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
          plan_id?: string
          starts_at?: string
          status?: string
          stripe_subscription_id?: string | null
          tenant_id?: string
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
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
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
          processed_date: string | null
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
          processed_date?: string | null
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
          processed_date?: string | null
          signup_date?: string
          status?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tenants: {
        Row: {
          admin_email: string
          admin_user_id: string | null
          company_name: string
          created_at: string
          domain: string | null
          id: string
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
          domain?: string | null
          id?: string
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
          domain?: string | null
          id?: string
          settings?: Json | null
          status?: string
          subscription_status?: string | null
          trial_ends_at?: string | null
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
      create_super_admin_user: {
        Args: { user_email: string; user_password: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "administrator" | "reception" | "registered_nurse" | "caregiver"
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
      app_role: ["administrator", "reception", "registered_nurse", "caregiver"],
    },
  },
} as const
