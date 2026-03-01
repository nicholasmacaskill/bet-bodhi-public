-- Agent's Internal "Stream of Consciousness" logs
CREATE TABLE IF NOT EXISTS agent_internal_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    action_type TEXT NOT NULL, -- e.g., 'scan', 'intervention', 'reflection'
    content TEXT NOT NULL, -- The agent's reasoning or raw thought process
    metadata JSONB DEFAULT '{}'::jsonb -- Any relevant data (game PKs, stake math, etc.)
);

CREATE INDEX IF NOT EXISTS idx_agent_internal_logs_type ON agent_internal_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_agent_internal_logs_created ON agent_internal_logs(created_at);
