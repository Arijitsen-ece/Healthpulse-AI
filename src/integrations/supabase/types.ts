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
      appointments: {
        Row: {
          appointment_date: string
          created_at: string | null
          doctor_id: string
          doctor_notes: string | null
          id: string
          patient_id: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          symptoms_summary: string | null
          updated_at: string | null
        }
        Insert: {
          appointment_date: string
          created_at?: string | null
          doctor_id: string
          doctor_notes?: string | null
          id?: string
          patient_id: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptoms_summary?: string | null
          updated_at?: string | null
        }
        Update: {
          appointment_date?: string
          created_at?: string | null
          doctor_id?: string
          doctor_notes?: string | null
          id?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          symptoms_summary?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["user_id"]
          },
        ]
      }
      doctors: {
        Row: {
          available: boolean | null
          bio: string | null
          created_at: string | null
          demo_account: boolean | null
          hospital_affiliation: string | null
          id: string
          license_number: string
          rating: number | null
          specialization: string
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          available?: boolean | null
          bio?: string | null
          created_at?: string | null
          demo_account?: boolean | null
          hospital_affiliation?: string | null
          id?: string
          license_number: string
          rating?: number | null
          specialization: string
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          available?: boolean | null
          bio?: string | null
          created_at?: string | null
          demo_account?: boolean | null
          hospital_affiliation?: string | null
          id?: string
          license_number?: string
          rating?: number | null
          specialization?: string
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      emergency_incidents: {
        Row: {
          created_at: string | null
          emergency_contacts_notified: Json | null
          id: string
          latitude: number
          longitude: number
          notes: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["emergency_status"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          emergency_contacts_notified?: Json | null
          id?: string
          latitude: number
          longitude: number
          notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["emergency_status"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          emergency_contacts_notified?: Json | null
          id?: string
          latitude?: number
          longitude?: number
          notes?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["emergency_status"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          blood_group: string | null
          chronic_conditions: string[] | null
          created_at: string | null
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          blood_group?: string | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          blood_group?: string | null
          chronic_conditions?: string[] | null
          created_at?: string | null
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      symptom_sessions: {
        Row: {
          ai_analysis: Json | null
          confidence_score: number | null
          created_at: string | null
          id: string
          image_path: string | null
          recommended_specialty: string | null
          symptoms_text: string
          triage_level: Database["public"]["Enums"]["triage_level"] | null
          user_id: string | null
        }
        Insert: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          image_path?: string | null
          recommended_specialty?: string | null
          symptoms_text: string
          triage_level?: Database["public"]["Enums"]["triage_level"] | null
          user_id?: string | null
        }
        Update: {
          ai_analysis?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          image_path?: string | null
          recommended_specialty?: string | null
          symptoms_text?: string
          triage_level?: Database["public"]["Enums"]["triage_level"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      doctor_directory: {
        Row: {
          available: boolean | null
          bio: string | null
          full_name: string | null
          hospital_affiliation: string | null
          id: string | null
          rating: number | null
          specialization: string | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          available?: boolean | null
          bio?: string | null
          full_name?: never
          hospital_affiliation?: string | null
          id?: string | null
          rating?: number | null
          specialization?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          available?: boolean | null
          bio?: string | null
          full_name?: never
          hospital_affiliation?: string | null
          id?: string | null
          rating?: number | null
          specialization?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      appointment_status: "requested" | "confirmed" | "completed" | "cancelled"
      emergency_status: "active" | "responded" | "resolved"
      triage_level: "green" | "yellow" | "red"
      user_role: "patient" | "doctor" | "admin"
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
      appointment_status: ["requested", "confirmed", "completed", "cancelled"],
      emergency_status: ["active", "responded", "resolved"],
      triage_level: ["green", "yellow", "red"],
      user_role: ["patient", "doctor", "admin"],
    },
  },
} as const
