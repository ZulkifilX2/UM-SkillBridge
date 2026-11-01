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
          email: string;
          display_name: string;
          faculty: string;
          year_of_study: number;
          bio: string;
          avatar_initials: string;
          avatar_color: string;
          account_status: 'Active' | 'Suspended' | 'Deactivated';
          role: 'student' | 'moderator' | 'admin';
          weekly_tutoring_cap_hours: number;
          weekly_tutoring_used_hours: number;
          is_verified_student: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          faculty: string;
          year_of_study?: number;
          bio?: string;
          avatar_initials?: string;
          avatar_color?: string;
          account_status?: 'Active' | 'Suspended' | 'Deactivated';
          role?: 'student' | 'moderator' | 'admin';
          weekly_tutoring_cap_hours?: number;
          weekly_tutoring_used_hours?: number;
          is_verified_student?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          faculty?: string;
          year_of_study?: number;
          bio?: string;
          avatar_initials?: string;
          avatar_color?: string;
          account_status?: 'Active' | 'Suspended' | 'Deactivated';
          role?: 'student' | 'moderator' | 'admin';
          weekly_tutoring_cap_hours?: number;
          weekly_tutoring_used_hours?: number;
          is_verified_student?: boolean;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          slug: string;
          title: string;
          category: string;
          description: string;
          icon: string;
          moderation_status: 'Pending' | 'Approved' | 'Rejected';
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          category: string;
          description?: string;
          icon?: string;
          moderation_status?: 'Pending' | 'Approved' | 'Rejected';
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          category?: string;
          description?: string;
          icon?: string;
          moderation_status?: 'Pending' | 'Approved' | 'Rejected';
          updated_at?: string;
        };
      };
      user_skills: {
        Row: {
          id: string;
          user_id: string;
          skill_id: string;
          relationship: 'teach' | 'learn';
          proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
          description: string;
          preferred_mode: 'Online' | 'In-Person' | 'Both';
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_id: string;
          relationship: 'teach' | 'learn';
          proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
          description?: string;
          preferred_mode?: 'Online' | 'In-Person' | 'Both';
          language?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          proficiency?: 'Beginner' | 'Intermediate' | 'Advanced';
          description?: string;
          preferred_mode?: 'Online' | 'In-Person' | 'Both';
          language?: string;
          updated_at?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          user_id: string;
          day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
          start_time: string;
          end_time: string;
          mode: 'Online' | 'In-Person' | 'Both';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          day_of_week: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
          start_time: string;
          end_time: string;
          mode?: 'Online' | 'In-Person' | 'Both';
          created_at?: string;
        };
        Update: {
          day_of_week?: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
          start_time?: string;
          end_time?: string;
          mode?: 'Online' | 'In-Person' | 'Both';
        };
      };
      sessions: {
        Row: {
          id: string;
          mentor_id: string;
          learner_id: string;
          skill_id: string;
          duration_minutes: number;
          scheduled_time: string;
          mode: 'Online' | 'In-Person' | 'Both';
          status: 'Requested' | 'Accepted' | 'Declined' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Disputed';
          credit_cost: number;
          location: string | null;
          meeting_link: string | null;
          learning_goals: string | null;
          mentor_confirmed: boolean;
          learner_confirmed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mentor_id: string;
          learner_id: string;
          skill_id: string;
          duration_minutes: number;
          scheduled_time: string;
          mode: 'Online' | 'In-Person' | 'Both';
          status?: 'Requested' | 'Accepted' | 'Declined' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Disputed';
          credit_cost?: number;
          location?: string | null;
          meeting_link?: string | null;
          learning_goals?: string | null;
          mentor_confirmed?: boolean;
          learner_confirmed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          status?: 'Requested' | 'Accepted' | 'Declined' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Disputed';
          location?: string | null;
          meeting_link?: string | null;
          mentor_confirmed?: boolean;
          learner_confirmed?: boolean;
          completed_at?: string | null;
        };
      };
      credit_accounts: {
        Row: {
          id: string;
          user_id: string;
          available_balance: number;
          reserved_balance: number;
          total_earned: number;
          total_spent: number;
          promotional_received: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          available_balance?: number;
          reserved_balance?: number;
          total_earned?: number;
          total_spent?: number;
          promotional_received?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          available_balance?: number;
          reserved_balance?: number;
          total_earned?: number;
          total_spent?: number;
          promotional_received?: number;
          updated_at?: string;
        };
      };
      credit_transactions: {
        Row: {
          id: string;
          account_id: string;
          user_id: string;
          session_id: string | null;
          transaction_type: 'Earned' | 'Spent' | 'Reserved' | 'Released' | 'Promotional' | 'Refunded';
          amount: number;
          status: 'Pending' | 'Completed' | 'Reversed';
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          account_id: string;
          user_id: string;
          session_id?: string | null;
          transaction_type: 'Earned' | 'Spent' | 'Reserved' | 'Released' | 'Promotional' | 'Refunded';
          amount: number;
          status?: 'Pending' | 'Completed' | 'Reversed';
          description: string;
          created_at?: string;
        };
        Update: {
          status?: 'Pending' | 'Completed' | 'Reversed';
        };
      };
      feedbacks: {
        Row: {
          id: string;
          session_id: string;
          author_id: string;
          rating: number;
          comment: string | null;
          is_private: boolean;
          tags: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          author_id: string;
          rating: number;
          comment?: string | null;
          is_private?: boolean;
          tags?: string[];
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string | null;
          is_private?: boolean;
          tags?: string[];
        };
      };
      reports: {
        Row: {
          id: string;
          reporter_id: string;
          reported_user_id: string | null;
          reported_session_id: string | null;
          reason: string;
          details: string | null;
          status: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';
          resolution_notes: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          reporter_id: string;
          reported_user_id?: string | null;
          reported_session_id?: string | null;
          reason: string;
          details?: string | null;
          status?: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';
          created_at?: string;
        };
        Update: {
          status?: 'Open' | 'Investigating' | 'Resolved' | 'Dismissed';
          resolution_notes?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          old_data: Json | null;
          new_data: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          old_data?: Json | null;
          new_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
        };
      };
    };
  };
}
