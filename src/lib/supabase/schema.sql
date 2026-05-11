-- Leads table for capturing user information
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Audits table for storing the results of each audit
CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  total_spend NUMERIC(12, 2),
  potential_savings NUMERIC(12, 2),
  result_data JSONB NOT NULL
);

-- Index for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_audits_lead_id ON audits(lead_id);
