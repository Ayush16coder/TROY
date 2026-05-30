-- RLS policies required for integrations, tokens, and workspace data writes

-- Integrations
CREATE POLICY "workspace members read integrations"
  ON integrations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integrations.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members insert integrations"
  ON integrations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integrations.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members update integrations"
  ON integrations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integrations.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members delete integrations"
  ON integrations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integrations.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Integration tokens
CREATE POLICY "workspace members read integration tokens"
  ON integration_tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integration_tokens.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members insert integration tokens"
  ON integration_tokens FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integration_tokens.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members update integration tokens"
  ON integration_tokens FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integration_tokens.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members delete integration tokens"
  ON integration_tokens FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = integration_tokens.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Repositories
CREATE POLICY "workspace members read repositories"
  ON repositories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = repositories.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members manage repositories"
  ON repositories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = repositories.workspace_id AND wm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = repositories.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Projects insert/update
CREATE POLICY "workspace members insert projects"
  ON projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = projects.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members update projects"
  ON projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = projects.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Deployments write (for sync jobs)
CREATE POLICY "workspace members insert deployments"
  ON deployments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = deployments.workspace_id AND wm.user_id = auth.uid()
    )
  );

CREATE POLICY "workspace members update deployments"
  ON deployments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = deployments.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Activity logs insert
CREATE POLICY "workspace members insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = activity_logs.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Notifications
CREATE POLICY "users read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "users update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Environments
CREATE POLICY "workspace members read environments"
  ON environments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = environments.workspace_id AND wm.user_id = auth.uid()
    )
  );

-- Team: read profiles of members in same workspace
CREATE POLICY "members read workspace user profiles"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members wm_self
      JOIN workspace_members wm_other ON wm_self.workspace_id = wm_other.workspace_id
      WHERE wm_self.user_id = auth.uid() AND wm_other.user_id = users.id
    )
  );

-- Sync events read
CREATE POLICY "workspace members read sync events"
  ON sync_events FOR SELECT
  USING (
    workspace_id IN (
      SELECT wm.workspace_id::text FROM workspace_members wm WHERE wm.user_id = auth.uid()
    )
    OR workspace_id IN (
      SELECT w.id::text FROM workspaces w
      JOIN workspace_members wm ON wm.workspace_id = w.id
      WHERE wm.user_id = auth.uid()
    )
  );
