-- NexusForge Initial Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum types
CREATE TYPE workspace_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');
CREATE TYPE project_status AS ENUM ('active', 'archived', 'paused');
CREATE TYPE deployment_provider AS ENUM ('vercel', 'netlify', 'railway', 'render', 'aws');
CREATE TYPE deployment_status AS ENUM ('queued', 'building', 'ready', 'error', 'cancelled');
CREATE TYPE environment_type AS ENUM ('production', 'preview', 'development');
CREATE TYPE log_level AS ENUM ('info', 'warn', 'error', 'debug');
CREATE TYPE integration_status AS ENUM ('connected', 'disconnected', 'error', 'pending');
CREATE TYPE ai_context_type AS ENUM ('deployment', 'repository', 'general', 'logs');
CREATE TYPE ai_message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE sync_event_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- 1. Users
CREATE TABLE users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    github_username TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Workspaces
CREATE TABLE workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan workspace_plan NOT NULL DEFAULT 'free',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- 3. Workspace Members
CREATE TABLE workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role workspace_role NOT NULL DEFAULT 'member',
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    joined_at TIMESTAMPTZ,
    UNIQUE(workspace_id, user_id)
);
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- 4. Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    framework TEXT,
    repository_id UUID, -- Foreign key added below
    status project_status NOT NULL DEFAULT 'active',
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, slug)
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 5. Repositories
CREATE TABLE repositories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    github_id BIGINT NOT NULL,
    full_name TEXT NOT NULL,
    name TEXT NOT NULL,
    private BOOLEAN NOT NULL DEFAULT false,
    default_branch TEXT NOT NULL DEFAULT 'main',
    last_commit_sha TEXT,
    last_commit_message TEXT,
    last_commit_at TIMESTAMPTZ,
    webhook_id BIGINT,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, github_id)
);
ALTER TABLE repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ADD CONSTRAINT fk_project_repo FOREIGN KEY (repository_id) REFERENCES repositories(id) ON DELETE SET NULL;

-- 6. Deployments
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider deployment_provider NOT NULL,
    provider_deployment_id TEXT,
    status deployment_status NOT NULL DEFAULT 'queued',
    environment environment_type NOT NULL DEFAULT 'preview',
    branch TEXT,
    commit_sha TEXT,
    commit_message TEXT,
    url TEXT,
    build_duration_ms INTEGER,
    triggered_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
ALTER TABLE deployments ENABLE ROW LEVEL SECURITY;

-- 7. Deployment Logs
CREATE TABLE deployment_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployment_id UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    level log_level NOT NULL DEFAULT 'info',
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source TEXT
);
-- Optimized for high-volume inserts, omit RLS or use very simple RLS.
ALTER TABLE deployment_logs ENABLE ROW LEVEL SECURITY;

-- 8. Environments (Variables metadata, actual values stored securely elsewhere/encrypted)
CREATE TABLE environments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type environment_type NOT NULL,
    variables_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(project_id, name)
);
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;

-- 9. Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    name TEXT NOT NULL,
    status integration_status NOT NULL DEFAULT 'pending',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, provider)
);
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- 10. Integration Tokens (Encrypted)
CREATE TABLE integration_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT,
    expires_at TIMESTAMPTZ,
    scopes TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(integration_id)
);
ALTER TABLE integration_tokens ENABLE ROW LEVEL SECURITY;

-- 11. AI Sessions
CREATE TABLE ai_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT,
    model TEXT NOT NULL,
    context_type ai_context_type NOT NULL DEFAULT 'general',
    context_id UUID, -- Could be deployment_id or repository_id
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ai_sessions ENABLE ROW LEVEL SECURITY;

-- 12. AI Messages
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES ai_sessions(id) ON DELETE CASCADE,
    role ai_message_role NOT NULL,
    content TEXT NOT NULL,
    model TEXT,
    tokens_used INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- 13. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 14. Activity Logs (Audit & Feed)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- 15. Sync Events (Webhook Queue)
CREATE TABLE sync_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id TEXT NOT NULL, -- Could be provider specific ID before mapping
    event_type TEXT NOT NULL,
    provider TEXT NOT NULL,
    payload JSONB NOT NULL,
    status sync_event_status NOT NULL DEFAULT 'pending',
    error TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE sync_events ENABLE ROW LEVEL SECURITY;

-- 16. Audit Logs (Compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- INDEXES
-------------------------------------------------------------------------------
CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_projects_workspace ON projects(workspace_id);
CREATE INDEX idx_repositories_workspace ON repositories(workspace_id);
CREATE INDEX idx_deployments_project ON deployments(project_id);
CREATE INDEX idx_deployments_workspace ON deployments(workspace_id);
CREATE INDEX idx_deployment_logs_deployment ON deployment_logs(deployment_id);
CREATE INDEX idx_deployment_logs_timestamp ON deployment_logs(timestamp DESC);
CREATE INDEX idx_activity_logs_workspace ON activity_logs(workspace_id, created_at DESC);
CREATE INDEX idx_sync_events_status ON sync_events(status);

-------------------------------------------------------------------------------
-- REALTIME SUBSCRIPTIONS
-------------------------------------------------------------------------------
-- Add publications for real-time streaming
ALTER PUBLICATION supabase_realtime ADD TABLE deployments;
ALTER PUBLICATION supabase_realtime ADD TABLE deployment_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE repositories;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------
-- Note: These are baseline policies. For production, more granular policies are needed.

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);

-- Users can read workspaces they are members of
CREATE POLICY "Users can read their workspaces" ON workspaces FOR SELECT USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = workspaces.id AND user_id = auth.uid())
);

-- Users can read workspace members for their workspaces
CREATE POLICY "Users can read workspace members" ON workspace_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM workspace_members AS wm WHERE wm.workspace_id = workspace_members.workspace_id AND wm.user_id = auth.uid())
);

-- Projects visibility
CREATE POLICY "Users can read workspace projects" ON projects FOR SELECT USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = projects.workspace_id AND user_id = auth.uid())
);

-- Deployments visibility
CREATE POLICY "Users can read workspace deployments" ON deployments FOR SELECT USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = deployments.workspace_id AND user_id = auth.uid())
);

-- Deployment Logs visibility
CREATE POLICY "Users can read deployment logs" ON deployment_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM deployments JOIN workspace_members ON deployments.workspace_id = workspace_members.workspace_id WHERE deployments.id = deployment_logs.deployment_id AND workspace_members.user_id = auth.uid())
);

-- Activity Logs visibility
CREATE POLICY "Users can read workspace activity logs" ON activity_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = activity_logs.workspace_id AND user_id = auth.uid())
);

-- AI Sessions visibility
CREATE POLICY "Users can read their own AI sessions" ON ai_sessions FOR ALL USING (
    user_id = auth.uid()
);

-- AI Messages visibility
CREATE POLICY "Users can read their AI messages" ON ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM ai_sessions WHERE id = ai_messages.session_id AND user_id = auth.uid())
);
