-- 1. Rename Integrations -> Provider Connections
ALTER TABLE integrations RENAME TO provider_connections;
ALTER INDEX IF EXISTS integrations_pkey RENAME TO provider_connections_pkey;
ALTER INDEX IF EXISTS integrations_workspace_id_provider_key RENAME TO provider_connections_workspace_id_provider_key;

-- 2. Rename Integration Tokens -> Provider Tokens
ALTER TABLE integration_tokens RENAME TO provider_tokens;
ALTER TABLE provider_tokens RENAME COLUMN integration_id TO connection_id;
ALTER INDEX IF EXISTS integration_tokens_pkey RENAME TO provider_tokens_pkey;
ALTER INDEX IF EXISTS integration_tokens_integration_id_key RENAME TO provider_tokens_connection_id_key;

-- Update RLS policies for renamed tables
DROP POLICY IF EXISTS "workspace members read integrations" ON provider_connections;
CREATE POLICY "workspace members read provider_connections" ON provider_connections FOR SELECT USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_connections.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members insert integrations" ON provider_connections;
CREATE POLICY "workspace members insert provider_connections" ON provider_connections FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_connections.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members update integrations" ON provider_connections;
CREATE POLICY "workspace members update provider_connections" ON provider_connections FOR UPDATE USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_connections.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members delete integrations" ON provider_connections;
CREATE POLICY "workspace members delete provider_connections" ON provider_connections FOR DELETE USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_connections.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members read integration tokens" ON provider_tokens;
CREATE POLICY "workspace members read provider_tokens" ON provider_tokens FOR SELECT USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_tokens.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members insert integration tokens" ON provider_tokens;
CREATE POLICY "workspace members insert provider_tokens" ON provider_tokens FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_tokens.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members update integration tokens" ON provider_tokens;
CREATE POLICY "workspace members update provider_tokens" ON provider_tokens FOR UPDATE USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_tokens.workspace_id AND wm.user_id = auth.uid()));

DROP POLICY IF EXISTS "workspace members delete integration tokens" ON provider_tokens;
CREATE POLICY "workspace members delete provider_tokens" ON provider_tokens FOR DELETE USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_tokens.workspace_id AND wm.user_id = auth.uid()));

-- 3. Create Provider Projects
CREATE TABLE provider_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID NOT NULL REFERENCES provider_connections(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider_project_id TEXT NOT NULL,
    name TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(connection_id, provider_project_id)
);
ALTER TABLE provider_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members read provider_projects" ON provider_projects FOR SELECT USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_projects.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "workspace members insert provider_projects" ON provider_projects FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_projects.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "workspace members update provider_projects" ON provider_projects FOR UPDATE USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_projects.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "workspace members delete provider_projects" ON provider_projects FOR DELETE USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_projects.workspace_id AND wm.user_id = auth.uid()));

-- 4. Create Provider Health
CREATE TABLE provider_health (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    connection_id UUID NOT NULL REFERENCES provider_connections(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    last_check_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    UNIQUE(connection_id)
);
ALTER TABLE provider_health ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workspace members read provider_health" ON provider_health FOR SELECT USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_health.workspace_id AND wm.user_id = auth.uid()));
CREATE POLICY "workspace members manage provider_health" ON provider_health FOR ALL USING (EXISTS (SELECT 1 FROM workspace_members wm WHERE wm.workspace_id = provider_health.workspace_id AND wm.user_id = auth.uid()));

-- 5. Create Webhook Events
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    status sync_event_status NOT NULL DEFAULT 'pending',
    error TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Note: webhook events are processed in backend, no RLS SELECT needed for normal users, but for safety:
CREATE POLICY "service role full access to webhook_events" ON webhook_events FOR ALL USING (true);
