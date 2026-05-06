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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      career_levels: {
        Row: {
          l_number: number
          level_code: string
          salary_band_max_aed: number | null
          salary_band_min_aed: number | null
          sort_order: number
          title: string
          track: string
        }
        Insert: {
          l_number: number
          level_code: string
          salary_band_max_aed?: number | null
          salary_band_min_aed?: number | null
          sort_order: number
          title: string
          track: string
        }
        Update: {
          l_number?: number
          level_code?: string
          salary_band_max_aed?: number | null
          salary_band_min_aed?: number | null
          sort_order?: number
          title?: string
          track?: string
        }
        Relationships: []
      }
      competencies: {
        Row: {
          group_name: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          group_name: string
          id?: string
          name: string
          sort_order: number
        }
        Update: {
          group_name?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string
          employee_id: string
          employment_type: string
          full_name: string
          id: string
          job_title: string
          last_promotion_date: string | null
          level_code: string
          location: string
          manager_email: string | null
          salary_aed: number | null
          start_date: string
          track: string
          updated_at: string
          work_email: string
        }
        Insert: {
          created_at?: string
          department: string
          employee_id: string
          employment_type?: string
          full_name: string
          id?: string
          job_title: string
          last_promotion_date?: string | null
          level_code: string
          location: string
          manager_email?: string | null
          salary_aed?: number | null
          start_date: string
          track: string
          updated_at?: string
          work_email: string
        }
        Update: {
          created_at?: string
          department?: string
          employee_id?: string
          employment_type?: string
          full_name?: string
          id?: string
          job_title?: string
          last_promotion_date?: string | null
          level_code?: string
          location?: string
          manager_email?: string | null
          salary_aed?: number | null
          start_date?: string
          track?: string
          updated_at?: string
          work_email?: string
        }
        Relationships: []
      }
      okr_pillars: {
        Row: {
          id: string
          is_active: boolean
          name: string
          sort_order: number
        }
        Insert: {
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
        }
        Update: {
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      promotion_history: {
        Row: {
          created_at: string
          direct_reports_count: number | null
          effective_date: string
          employee_id: string
          id: string
          new_level: string
          new_title: string
          previous_level: string | null
          previous_title: string | null
          salary_at_promotion_aed: number | null
          scope_note: string | null
        }
        Insert: {
          created_at?: string
          direct_reports_count?: number | null
          effective_date: string
          employee_id: string
          id?: string
          new_level: string
          new_title: string
          previous_level?: string | null
          previous_title?: string | null
          salary_at_promotion_aed?: number | null
          scope_note?: string | null
        }
        Update: {
          created_at?: string
          direct_reports_count?: number | null
          effective_date?: string
          employee_id?: string
          id?: string
          new_level?: string
          new_title?: string
          previous_level?: string | null
          previous_title?: string | null
          salary_at_promotion_aed?: number | null
          scope_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promotion_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_public"
            referencedColumns: ["id"]
          },
        ]
      }
      review_cycles: {
        Row: {
          calibration_due: string | null
          created_at: string
          id: string
          manager_review_due: string | null
          name: string
          quarter: number
          self_review_due: string | null
          status: string
          year: number
        }
        Insert: {
          calibration_due?: string | null
          created_at?: string
          id?: string
          manager_review_due?: string | null
          name: string
          quarter: number
          self_review_due?: string | null
          status?: string
          year: number
        }
        Update: {
          calibration_due?: string | null
          created_at?: string
          id?: string
          manager_review_due?: string | null
          name?: string
          quarter?: number
          self_review_due?: string | null
          status?: string
          year?: number
        }
        Relationships: []
      }
      review_responses: {
        Row: {
          competency_id: string | null
          created_at: string
          id: string
          note: string | null
          question_key: string | null
          rating: number | null
          respondent_type: string
          review_id: string
        }
        Insert: {
          competency_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          question_key?: string | null
          rating?: number | null
          respondent_type: string
          review_id: string
        }
        Update: {
          competency_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          question_key?: string | null
          rating?: number | null
          respondent_type?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_competency_id_fkey"
            columns: ["competency_id"]
            isOneToOne: false
            referencedRelation: "competencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          created_at: string
          cycle_id: string
          employee_id: string
          id: string
          manager_id: string | null
          overall_rating: string | null
          published_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          cycle_id: string
          employee_id: string
          id?: string
          manager_id?: string | null
          overall_rating?: string | null
          published_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          cycle_id?: string
          employee_id?: string
          id?: string
          manager_id?: string | null
          overall_rating?: string | null
          published_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_cycle_id_fkey"
            columns: ["cycle_id"]
            isOneToOne: false
            referencedRelation: "review_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_public"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees_public"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          employee_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees_public"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      employees_public: {
        Row: {
          created_at: string | null
          department: string | null
          employee_id: string | null
          employment_type: string | null
          full_name: string | null
          id: string | null
          job_title: string | null
          last_promotion_date: string | null
          level_code: string | null
          location: string | null
          manager_email: string | null
          start_date: string | null
          track: string | null
          updated_at: string | null
          work_email: string | null
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          employment_type?: string | null
          full_name?: string | null
          id?: string | null
          job_title?: string | null
          last_promotion_date?: string | null
          level_code?: string | null
          location?: string | null
          manager_email?: string | null
          start_date?: string | null
          track?: string | null
          updated_at?: string | null
          work_email?: string | null
        }
        Update: {
          created_at?: string | null
          department?: string | null
          employee_id?: string | null
          employment_type?: string | null
          full_name?: string | null
          id?: string | null
          job_title?: string | null
          last_promotion_date?: string | null
          level_code?: string | null
          location?: string | null
          manager_email?: string | null
          start_date?: string | null
          track?: string | null
          updated_at?: string | null
          work_email?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_employee_id: { Args: never; Returns: string }
      get_employee_salary: { Args: { _employee_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "employee" | "manager" | "department_head" | "hr_admin"
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
      app_role: ["employee", "manager", "department_head", "hr_admin"],
    },
  },
} as const
