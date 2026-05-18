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
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          github_username: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["users"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          plan: "free" | "pro" | "enterprise";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["workspaces"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>;
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: "owner" | "admin" | "member" | "viewer";
          invited_at: string;
          joined_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["workspace_members"]["Row"], "id" | "invited_at">;
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>;
      };
      projects: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          slug: string;
          description: string | null;
          framework: string | null;
          repository_id: string | null;
          status: "active" | "archived" | "paused";
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["projects"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      repositories: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string | null;
          github_id: number;
          full_name: string;
          name: string;
          private: boolean;
          default_branch: string;
          last_commit_sha: string | null;
          last_commit_message: string | null;
          last_commit_at: string | null;
          webhook_id: number | null;
          synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["repositories"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["repositories"]["Insert"]>;
      };
      deployments: {
        Row: {
          id: string;
          project_id: string;
          workspace_id: string;
          provider: "vercel" | "netlify" | "railway" | "render" | "aws";
          provider_deployment_id: string | null;
          status: "queued" | "building" | "ready" | "error" | "cancelled";
          environment: "production" | "preview" | "development";
          branch: string | null;
          commit_sha: string | null;
          commit_message: string | null;
          url: string | null;
          build_duration_ms: number | null;
          triggered_by: string | null;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["deployments"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["deployments"]["Insert"]>;
      };
      deployment_logs: {
        Row: {
          id: string;
          deployment_id: string;
          level: "info" | "warn" | "error" | "debug";
          message: string;
          timestamp: string;
          source: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["deployment_logs"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["deployment_logs"]["Insert"]>;
      };
      integrations: {
        Row: {
          id: string;
          workspace_id: string;
          provider: string;
          name: string;
          status: "connected" | "disconnected" | "error" | "pending";
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["integrations"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["integrations"]["Insert"]>;
      };
      integration_tokens: {
        Row: {
          id: string;
          integration_id: string;
          workspace_id: string;
          access_token_encrypted: string;
          refresh_token_encrypted: string | null;
          expires_at: string | null;
          scopes: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["integration_tokens"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["integration_tokens"]["Insert"]>;
      };
      ai_sessions: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          title: string | null;
          model: string;
          context_type: "deployment" | "repository" | "general" | "logs";
          context_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ai_sessions"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["ai_sessions"]["Insert"]>;
      };
      ai_messages: {
        Row: {
          id: string;
          session_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          model: string | null;
          tokens_used: number | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["ai_messages"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["ai_messages"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          workspace_id: string | null;
          type: string;
          title: string;
          message: string;
          read: boolean;
          action_url: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      activity_logs: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["activity_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["activity_logs"]["Insert"]>;
      };
      environments: {
        Row: {
          id: string;
          project_id: string;
          workspace_id: string;
          name: string;
          type: "production" | "preview" | "development";
          variables_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["environments"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["environments"]["Insert"]>;
      };
      sync_events: {
        Row: {
          id: string;
          workspace_id: string;
          event_type: string;
          provider: string;
          payload: Json;
          status: "pending" | "processing" | "completed" | "failed";
          error: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sync_events"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sync_events"]["Insert"]>;
      };
      audit_logs: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_logs"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience type aliases
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
export type WorkspaceMember = Database["public"]["Tables"]["workspace_members"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Repository = Database["public"]["Tables"]["repositories"]["Row"];
export type Deployment = Database["public"]["Tables"]["deployments"]["Row"];
export type DeploymentLog = Database["public"]["Tables"]["deployment_logs"]["Row"];
export type Integration = Database["public"]["Tables"]["integrations"]["Row"];
export type AiSession = Database["public"]["Tables"]["ai_sessions"]["Row"];
export type AiMessage = Database["public"]["Tables"]["ai_messages"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
export type Environment = Database["public"]["Tables"]["environments"]["Row"];
export type SyncEvent = Database["public"]["Tables"]["sync_events"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_logs"]["Row"];
