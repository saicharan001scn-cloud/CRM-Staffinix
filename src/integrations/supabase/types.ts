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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          created_by_chain: Json | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          is_super_admin_activity: boolean | null
          performer_role: string | null
          target_user_id: string | null
          user_agent: string | null
          user_id: string | null
          visibility_scope: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          created_by_chain?: Json | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_super_admin_activity?: boolean | null
          performer_role?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          visibility_scope?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          created_by_chain?: Json | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          is_super_admin_activity?: boolean | null
          performer_role?: string | null
          target_user_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          visibility_scope?: string | null
        }
        Relationships: []
      }
      consultants: {
        Row: {
          added_by_email: string | null
          ai_summary: string | null
          created_at: string | null
          email: string
          experience: number | null
          id: string
          location: string | null
          name: string
          phone: string | null
          rate: number | null
          resume_url: string | null
          skills: string[] | null
          status: Database["public"]["Enums"]["consultant_status"] | null
          updated_at: string | null
          user_id: string
          visa_status: Database["public"]["Enums"]["visa_status"]
        }
        Insert: {
          added_by_email?: string | null
          ai_summary?: string | null
          created_at?: string | null
          email: string
          experience?: number | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          rate?: number | null
          resume_url?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["consultant_status"] | null
          updated_at?: string | null
          user_id: string
          visa_status: Database["public"]["Enums"]["visa_status"]
        }
        Update: {
          added_by_email?: string | null
          ai_summary?: string | null
          created_at?: string | null
          email?: string
          experience?: number | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          rate?: number | null
          resume_url?: string | null
          skills?: string[] | null
          status?: Database["public"]["Enums"]["consultant_status"] | null
          updated_at?: string | null
          user_id?: string
          visa_status?: Database["public"]["Enums"]["visa_status"]
        }
        Relationships: []
      }
      jobs: {
        Row: {
          client: string
          created_at: string | null
          deadline: string | null
          description: string | null
          id: string
          job_type: Database["public"]["Enums"]["job_type"] | null
          location: string | null
          matched_consultants: number | null
          portal_apply_url: string | null
          posted_date: string | null
          rate_max: number | null
          rate_min: number | null
          skills: string[] | null
          source: string | null
          source_type: Database["public"]["Enums"]["job_source_type"] | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
          user_id: string
          vendor_email: string | null
          vendor_name: string | null
          visa_requirements: Database["public"]["Enums"]["visa_status"][] | null
        }
        Insert: {
          client: string
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          matched_consultants?: number | null
          portal_apply_url?: string | null
          posted_date?: string | null
          rate_max?: number | null
          rate_min?: number | null
          skills?: string[] | null
          source?: string | null
          source_type?: Database["public"]["Enums"]["job_source_type"] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
          user_id: string
          vendor_email?: string | null
          vendor_name?: string | null
          visa_requirements?:
            | Database["public"]["Enums"]["visa_status"][]
            | null
        }
        Update: {
          client?: string
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          id?: string
          job_type?: Database["public"]["Enums"]["job_type"] | null
          location?: string | null
          matched_consultants?: number | null
          portal_apply_url?: string | null
          posted_date?: string | null
          rate_max?: number | null
          rate_min?: number | null
          skills?: string[] | null
          source?: string | null
          source_type?: Database["public"]["Enums"]["job_source_type"] | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string
          vendor_email?: string | null
          vendor_name?: string | null
          visa_requirements?:
            | Database["public"]["Enums"]["visa_status"][]
            | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          failure_reason: string | null
          id: string
          ip_address: string | null
          login_at: string | null
          success: boolean | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          login_at?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          failure_reason?: string | null
          id?: string
          ip_address?: string | null
          login_at?: string | null
          success?: boolean | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"] | null
          analytics_access_granted_at: string | null
          analytics_access_granted_by: string | null
          avatar_url: string | null
          can_view_analytics: boolean | null
          company_name: string | null
          created_at: string
          created_by: string | null
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          notes: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          analytics_access_granted_at?: string | null
          analytics_access_granted_by?: string | null
          avatar_url?: string | null
          can_view_analytics?: boolean | null
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"] | null
          analytics_access_granted_at?: string | null
          analytics_access_granted_by?: string | null
          avatar_url?: string | null
          can_view_analytics?: boolean | null
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          notes?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_history: {
        Row: {
          changed_by: string | null
          changed_date: string | null
          id: string
          new_rate: number
          old_rate: number | null
          rate_type: string | null
          reason: string | null
          submission_id: string
        }
        Insert: {
          changed_by?: string | null
          changed_date?: string | null
          id?: string
          new_rate: number
          old_rate?: number | null
          rate_type?: string | null
          reason?: string | null
          submission_id: string
        }
        Update: {
          changed_by?: string | null
          changed_date?: string | null
          id?: string
          new_rate?: number
          old_rate?: number | null
          rate_type?: string | null
          reason?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rate_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      status_history: {
        Row: {
          changed_by: string | null
          changed_date: string | null
          from_status: Database["public"]["Enums"]["submission_status"] | null
          id: string
          notes: string | null
          submission_id: string
          to_status: Database["public"]["Enums"]["submission_status"]
        }
        Insert: {
          changed_by?: string | null
          changed_date?: string | null
          from_status?: Database["public"]["Enums"]["submission_status"] | null
          id?: string
          notes?: string | null
          submission_id: string
          to_status: Database["public"]["Enums"]["submission_status"]
        }
        Update: {
          changed_by?: string | null
          changed_date?: string | null
          from_status?: Database["public"]["Enums"]["submission_status"] | null
          id?: string
          notes?: string | null
          submission_id?: string
          to_status?: Database["public"]["Enums"]["submission_status"]
        }
        Relationships: [
          {
            foreignKeyName: "status_history_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          applied_rate: number | null
          consultant_id: string
          created_at: string | null
          id: string
          interview_date: string | null
          job_id: string
          notes: string | null
          offer_details: string | null
          rate_confirmation_date: string | null
          status: Database["public"]["Enums"]["submission_status"] | null
          status_changed_by: string | null
          status_changed_date: string | null
          submission_date: string | null
          submission_rate: number | null
          updated_at: string | null
          user_id: string
          vendor_contact: string | null
          vendor_id: string
        }
        Insert: {
          applied_rate?: number | null
          consultant_id: string
          created_at?: string | null
          id?: string
          interview_date?: string | null
          job_id: string
          notes?: string | null
          offer_details?: string | null
          rate_confirmation_date?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          status_changed_by?: string | null
          status_changed_date?: string | null
          submission_date?: string | null
          submission_rate?: number | null
          updated_at?: string | null
          user_id: string
          vendor_contact?: string | null
          vendor_id: string
        }
        Update: {
          applied_rate?: number | null
          consultant_id?: string
          created_at?: string | null
          id?: string
          interview_date?: string | null
          job_id?: string
          notes?: string | null
          offer_details?: string | null
          rate_confirmation_date?: string | null
          status?: Database["public"]["Enums"]["submission_status"] | null
          status_changed_by?: string | null
          status_changed_date?: string | null
          submission_date?: string | null
          submission_rate?: number | null
          updated_at?: string | null
          user_id?: string
          vendor_contact?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "consultants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          expires_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          expires_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          company_name: string
          created_at: string | null
          email: string
          id: string
          last_interaction: string | null
          notes: string | null
          phone: string | null
          placements: number | null
          recruiter_name: string
          total_submissions: number | null
          trust_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          email: string
          id?: string
          last_interaction?: string | null
          notes?: string | null
          phone?: string | null
          placements?: number | null
          recruiter_name: string
          total_submissions?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          email?: string
          id?: string
          last_interaction?: string | null
          notes?: string | null
          phone?: string | null
          placements?: number | null
          recruiter_name?: string
          total_submissions?: number | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      account_status: "active" | "suspended" | "pending"
      app_role: "super_admin" | "admin" | "user"
      consultant_status:
        | "bench"
        | "available"
        | "marketing"
        | "placed"
        | "interview"
      job_source_type: "portal" | "vendor_email"
      job_status: "open" | "closed" | "filled"
      job_type: "W2" | "C2C" | "Both" | "1099"
      submission_status:
        | "applied"
        | "submission"
        | "interview_scheduled"
        | "client_interview"
        | "offer_letter"
        | "placed"
        | "rejected"
      visa_status:
        | "H1B"
        | "OPT"
        | "CPT"
        | "GC"
        | "USC"
        | "L1"
        | "L2"
        | "H4 EAD"
        | "TN"
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
      account_status: ["active", "suspended", "pending"],
      app_role: ["super_admin", "admin", "user"],
      consultant_status: [
        "bench",
        "available",
        "marketing",
        "placed",
        "interview",
      ],
      job_source_type: ["portal", "vendor_email"],
      job_status: ["open", "closed", "filled"],
      job_type: ["W2", "C2C", "Both", "1099"],
      submission_status: [
        "applied",
        "submission",
        "interview_scheduled",
        "client_interview",
        "offer_letter",
        "placed",
        "rejected",
      ],
      visa_status: [
        "H1B",
        "OPT",
        "CPT",
        "GC",
        "USC",
        "L1",
        "L2",
        "H4 EAD",
        "TN",
      ],
    },
  },
} as const
