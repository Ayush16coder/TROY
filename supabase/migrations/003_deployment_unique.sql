CREATE UNIQUE INDEX IF NOT EXISTS idx_deployments_provider_deployment
  ON deployments (workspace_id, provider, provider_deployment_id)
  WHERE provider_deployment_id IS NOT NULL;
