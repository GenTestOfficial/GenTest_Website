export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          clerk_id: string
          email: string
          created_at: string
          updated_at: string
          tier: 'free' | 'pro'
          token_usage: number
          token_limit: number
        }
        Insert: {
          id?: string
          clerk_id: string
          email: string
          created_at?: string
          updated_at?: string
          tier?: 'free' | 'pro'
          token_usage?: number
          token_limit?: number
        }
        Update: {
          id?: string
          clerk_id?: string
          email?: string
          created_at?: string
          updated_at?: string
          tier?: 'free' | 'pro'
          token_usage?: number
          token_limit?: number
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: 'active' | 'inactive' | 'trial'
          plan: 'free' | 'pro'
          current_period_start: string
          current_period_end: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: 'active' | 'inactive' | 'trial'
          plan?: 'free' | 'pro'
          current_period_start: string
          current_period_end: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: 'active' | 'inactive' | 'trial'
          plan?: 'free' | 'pro'
          current_period_start?: string
          current_period_end?: string
          created_at?: string
          updated_at?: string
        }
      }
      test_history: {
        Row: {
          id: string
          user_id: string
          code: string
          test_code: string
          framework: string
          language: string
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          test_code: string
          framework: string
          language: string
          tokens_used: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          test_code?: string
          framework?: string
          language?: string
          tokens_used?: number
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          date: string
          tokens_used: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          tokens_used: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          tokens_used?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 