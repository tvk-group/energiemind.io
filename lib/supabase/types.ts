export type UserRole = "user" | "operator" | "developer" | "admin";
export type AccessRequestStatus = "pending" | "approved" | "rejected";
export type AlertSeverity = "info" | "warning" | "critical";
export type MinerStatus = "online" | "offline" | "degraded" | "maintenance";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  role: UserRole;
  phone: string | null;
  locale: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AccessRequest {
  id: string;
  full_name: string;
  email: string;
  company: string;
  phone: string | null;
  use_case: string;
  message: string;
  status: AccessRequestStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  location: string | null;
  country: string | null;
  capacity_mw: number;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Miner {
  id: string;
  site_id: string;
  name: string;
  model: string;
  serial_number: string | null;
  status: MinerStatus;
  hash_rate_th: number;
  power_watts: number;
  temperature_c: number;
  efficiency_jth: number;
  firmware_version: string;
  pool_name: string | null;
  uptime_percent: number;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
  sites?: Site;
}

export interface EnergyMetric {
  id: string;
  site_id: string;
  recorded_at: string;
  power_kw: number;
  generation_kw: number;
  consumption_kwh: number;
  efficiency_percent: number;
  cost_per_kwh: number;
  carbon_intensity_g: number;
}

export interface HeatMetric {
  id: string;
  site_id: string;
  recorded_at: string;
  thermal_efficiency_percent: number;
  heat_recovered_kw: number;
  waste_heat_utilization_percent: number;
  cop_ratio: number;
  fuel_savings_percent: number;
}

export interface Alert {
  id: string;
  site_id: string | null;
  miner_id: string | null;
  title: string;
  message: string;
  severity: AlertSeverity;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
  sites?: Site;
}

export interface ApiKey {
  id: string;
  user_id: string;
  name: string;
  key_prefix: string;
  key_hash: string;
  scopes: string[];
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

/** Supabase-compatible schema types for typed clients (@supabase/server, supabase-js). */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          company: string | null;
          role: UserRole;
          phone: string | null;
          locale: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          company?: string | null;
          role?: UserRole;
          phone?: string | null;
          locale?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          company?: string | null;
          role?: UserRole;
          phone?: string | null;
          locale?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      access_requests: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          company: string;
          phone: string | null;
          use_case: string;
          message: string;
          status: AccessRequestStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          company: string;
          phone?: string | null;
          use_case: string;
          message: string;
          status?: AccessRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          company?: string;
          phone?: string | null;
          use_case?: string;
          message?: string;
          status?: AccessRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      sites: {
        Row: {
          id: string;
          name: string;
          slug: string;
          location: string | null;
          country: string | null;
          capacity_mw: number;
          is_active: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          location?: string | null;
          country?: string | null;
          capacity_mw?: number;
          is_active?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          location?: string | null;
          country?: string | null;
          capacity_mw?: number;
          is_active?: boolean;
          metadata?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      miners: {
        Row: {
          id: string;
          site_id: string;
          name: string;
          model: string;
          serial_number: string | null;
          status: MinerStatus;
          hash_rate_th: number;
          power_watts: number;
          temperature_c: number;
          efficiency_jth: number;
          firmware_version: string;
          pool_name: string | null;
          uptime_percent: number;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_id: string;
          name: string;
          model?: string;
          serial_number?: string | null;
          status?: MinerStatus;
          hash_rate_th?: number;
          power_watts?: number;
          temperature_c?: number;
          efficiency_jth?: number;
          firmware_version?: string;
          pool_name?: string | null;
          uptime_percent?: number;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string;
          name?: string;
          model?: string;
          serial_number?: string | null;
          status?: MinerStatus;
          hash_rate_th?: number;
          power_watts?: number;
          temperature_c?: number;
          efficiency_jth?: number;
          firmware_version?: string;
          pool_name?: string | null;
          uptime_percent?: number;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      energy_metrics: {
        Row: {
          id: string;
          site_id: string;
          recorded_at: string;
          power_kw: number;
          generation_kw: number;
          consumption_kwh: number;
          efficiency_percent: number;
          cost_per_kwh: number;
          carbon_intensity_g: number;
        };
        Insert: {
          id?: string;
          site_id: string;
          recorded_at?: string;
          power_kw?: number;
          generation_kw?: number;
          consumption_kwh?: number;
          efficiency_percent?: number;
          cost_per_kwh?: number;
          carbon_intensity_g?: number;
        };
        Update: {
          id?: string;
          site_id?: string;
          recorded_at?: string;
          power_kw?: number;
          generation_kw?: number;
          consumption_kwh?: number;
          efficiency_percent?: number;
          cost_per_kwh?: number;
          carbon_intensity_g?: number;
        };
        Relationships: [];
      };
      heat_metrics: {
        Row: {
          id: string;
          site_id: string;
          recorded_at: string;
          thermal_efficiency_percent: number;
          heat_recovered_kw: number;
          waste_heat_utilization_percent: number;
          cop_ratio: number;
          fuel_savings_percent: number;
        };
        Insert: {
          id?: string;
          site_id: string;
          recorded_at?: string;
          thermal_efficiency_percent?: number;
          heat_recovered_kw?: number;
          waste_heat_utilization_percent?: number;
          cop_ratio?: number;
          fuel_savings_percent?: number;
        };
        Update: {
          id?: string;
          site_id?: string;
          recorded_at?: string;
          thermal_efficiency_percent?: number;
          heat_recovered_kw?: number;
          waste_heat_utilization_percent?: number;
          cop_ratio?: number;
          fuel_savings_percent?: number;
        };
        Relationships: [];
      };
      alerts: {
        Row: {
          id: string;
          site_id: string | null;
          miner_id: string | null;
          title: string;
          message: string;
          severity: AlertSeverity;
          is_resolved: boolean;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          site_id?: string | null;
          miner_id?: string | null;
          title: string;
          message: string;
          severity?: AlertSeverity;
          is_resolved?: boolean;
          resolved_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          site_id?: string | null;
          miner_id?: string | null;
          title?: string;
          message?: string;
          severity?: AlertSeverity;
          is_resolved?: boolean;
          resolved_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      api_keys: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          scopes: string[];
          is_active: boolean;
          last_used_at: string | null;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          key_prefix: string;
          key_hash: string;
          scopes?: string[];
          is_active?: boolean;
          last_used_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          key_prefix?: string;
          key_hash?: string;
          scopes?: string[];
          is_active?: boolean;
          last_used_at?: string | null;
          expires_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: {
      user_role: UserRole;
      access_request_status: AccessRequestStatus;
      alert_severity: AlertSeverity;
      miner_status: MinerStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
