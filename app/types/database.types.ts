export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: "guest" | "user" | "admin" | null;
          status: "active" | "blocked" | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "guest" | "user" | "admin" | null;
          status?: "active" | "blocked" | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: "guest" | "user" | "admin" | null;
          status?: "active" | "blocked" | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          video_url: string;
          thumbnail_url: string | null;
          status: "published" | "hidden" | "blocked" | null;
          view_count: number | null;
          is_18_plus: boolean | null;
          created_at: string | null;
          updated_at: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          description?: string | null;
          video_url: string;
          thumbnail_url?: string | null;
          status?: "published" | "hidden" | "blocked" | null;
          view_count?: number | null;
          is_18_plus?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          video_url?: string;
          thumbnail_url?: string | null;
          status?: "published" | "hidden" | "blocked" | null;
          view_count?: number | null;
          is_18_plus?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
          deleted_at?: string | null;
        };
      };
      likes: {
        Row: {
          user_id: string;
          video_id: string;
          is_dislike: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          user_id: string;
          video_id: string;
          is_dislike?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          user_id?: string;
          video_id?: string;
          is_dislike?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          subscriber_id: string;
          creator_id: string;
          created_at: string | null;
        };
        Insert: {
          subscriber_id: string;
          creator_id: string;
          created_at?: string | null;
        };
        Update: {
          subscriber_id?: string;
          creator_id?: string;
          created_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          video_id: string;
          parent_id: string | null;
          content: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string;
          video_id: string;
          parent_id?: string | null;
          content: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          video_id?: string;
          parent_id?: string | null;
          content?: string;
          created_at?: string | null;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Video = Database["public"]["Tables"]["videos"]["Row"];
export type Like = Database["public"]["Tables"]["likes"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Comment = Database["public"]["Tables"]["comments"]["Row"];
