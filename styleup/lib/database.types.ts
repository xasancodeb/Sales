// Auto-generated types for Supabase tables
// Re-run `npx supabase gen types typescript` after schema changes

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type BookingStatus = "pending_payment" | "confirmed" | "completed" | "cancelled";
export type StylistStatus = "pending" | "active" | "suspended";
export type UserRole = "client" | "stylist" | "admin";
export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      stylists: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          bio: string | null;
          city: string;
          country: string;
          flag: string;
          specialty: string[];
          tagline: string | null;
          rating: number;
          reviews_count: number;
          sessions_completed: number;
          commission_rate: number;
          status: StylistStatus;
          gradient: string[];
          languages: string[];
          response_time: string;
          available_today: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stylists"]["Row"], "created_at"> & { created_at?: string };
        Update: Partial<Database["public"]["Tables"]["stylists"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          client_id: string;
          stylist_id: string;
          service_name: string;
          session_type: string;
          date: string;
          time: string;
          price: number;
          platform_fee: number;
          currency: string;
          notes: string | null;
          status: BookingStatus;
          stripe_session_id: string | null;
          stripe_payment_intent_id: string | null;
          payment_status: "unpaid" | "paid" | "refunded";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "created_at"> & { created_at?: string };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      stylist_applications: {
        Row: {
          id: string;
          name: string;
          email: string;
          city: string;
          specialty: string | null;
          instagram: string | null;
          status: ApplicationStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["stylist_applications"]["Row"], "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["stylist_applications"]["Insert"]>;
      };
    };
  };
}
