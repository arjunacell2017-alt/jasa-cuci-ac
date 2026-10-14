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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          ac_type: string
          alamat: string
          assigned_at: string | null
          created_at: string
          id: string
          keluhan: string
          nama: string
          service_label: string
          service_type_id: string | null
          status: Database["public"]["Enums"]["booking_status"]
          tanggal: string | null
          technician_id: string | null
          technician_notes: string
          unit_count: number
          updated_at: string
          waktu: string
          whatsapp: string
        }
        Insert: {
          ac_type?: string
          alamat: string
          assigned_at?: string | null
          created_at?: string
          id?: string
          keluhan?: string
          nama: string
          service_label: string
          service_type_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tanggal?: string | null
          technician_id?: string | null
          technician_notes?: string
          unit_count?: number
          updated_at?: string
          waktu?: string
          whatsapp: string
        }
        Update: {
          ac_type?: string
          alamat?: string
          assigned_at?: string | null
          created_at?: string
          id?: string
          keluhan?: string
          nama?: string
          service_label?: string
          service_type_id?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          tanggal?: string | null
          technician_id?: string | null
          technician_notes?: string
          unit_count?: number
          updated_at?: string
          waktu?: string
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      maintenance_packages: {
        Row: {
          created_at: string
          description: string
          display_order: number
          features: string[]
          id: string
          is_active: boolean
          is_highlighted: boolean
          name: string
          period: string
          price: number | null
          price_label: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          features?: string[]
          id?: string
          is_active?: boolean
          is_highlighted?: boolean
          name: string
          period?: string
          price?: number | null
          price_label?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          features?: string[]
          id?: string
          is_active?: boolean
          is_highlighted?: boolean
          name?: string
          period?: string
          price?: number | null
          price_label?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      period_prices: {
        Row: {
          created_at: string
          id: string
          note: string
          period_id: string
          price: number
          price_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string
          period_id: string
          price: number
          price_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string
          period_id?: string
          price?: number
          price_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "period_prices_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "price_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "period_prices_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
        ]
      }
      price_periods: {
        Row: {
          created_at: string
          description: string
          ends_on: string
          id: string
          is_active: boolean
          name: string
          priority: number
          starts_on: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          ends_on: string
          id?: string
          is_active?: boolean
          name: string
          priority?: number
          starts_on: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          ends_on?: string
          id?: string
          is_active?: boolean
          name?: string
          priority?: number
          starts_on?: string
          updated_at?: string
        }
        Relationships: []
      }
      prices: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          price: number | null
          price_unit: string
          service_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          price?: number | null
          price_unit?: string
          service_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          price?: number | null
          price_unit?: string
          service_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prices_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_types: {
        Row: {
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string
          display_order: number
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      technician_services: {
        Row: {
          service_type_id: string
          technician_id: string
        }
        Insert: {
          service_type_id: string
          technician_id: string
        }
        Update: {
          service_type_id?: string
          technician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "technician_services_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_services_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          alamat: string
          area_layanan: string
          catatan_admin: string
          created_at: string
          email: string
          foto_path: string | null
          id: string
          kabupaten: string
          kecamatan: string
          nama_teknisi: string
          nama_usaha: string
          nomor_telepon: string
          nomor_whatsapp: string
          radius_layanan_km: number | null
          status: Database["public"]["Enums"]["technician_status"]
          updated_at: string
        }
        Insert: {
          alamat?: string
          area_layanan?: string
          catatan_admin?: string
          created_at?: string
          email?: string
          foto_path?: string | null
          id?: string
          kabupaten: string
          kecamatan?: string
          nama_teknisi: string
          nama_usaha?: string
          nomor_telepon?: string
          nomor_whatsapp: string
          radius_layanan_km?: number | null
          status?: Database["public"]["Enums"]["technician_status"]
          updated_at?: string
        }
        Update: {
          alamat?: string
          area_layanan?: string
          catatan_admin?: string
          created_at?: string
          email?: string
          foto_path?: string | null
          id?: string
          kabupaten?: string
          kecamatan?: string
          nama_teknisi?: string
          nama_usaha?: string
          nomor_telepon?: string
          nomor_whatsapp?: string
          radius_layanan_km?: number | null
          status?: Database["public"]["Enums"]["technician_status"]
          updated_at?: string
        }
        Relationships: []
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "technician" | "customer"
      booking_status:
        | "menunggu_teknisi"
        | "teknisi_dihubungi"
        | "teknisi_menerima"
        | "dijadwalkan"
        | "dalam_pengerjaan"
        | "selesai"
        | "dibatalkan"
      technician_status: "aktif" | "sibuk" | "tidak_aktif"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "technician", "customer"],
      booking_status: [
        "menunggu_teknisi",
        "teknisi_dihubungi",
        "teknisi_menerima",
        "dijadwalkan",
        "dalam_pengerjaan",
        "selesai",
        "dibatalkan",
      ],
      technician_status: ["aktif", "sibuk", "tidak_aktif"],
    },
  },
} as const
