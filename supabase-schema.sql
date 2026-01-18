-- ChangeLogic Professor Tracker CRM Schema
-- Run this in your Supabase SQL Editor

-- Create professors table
CREATE TABLE professors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  role TEXT DEFAULT 'Professor',
  core_ip TEXT[] DEFAULT '{}',
  exec_ed_programs TEXT[] DEFAULT '{}',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL CHECK (status IN ('Identified', 'In Contact', 'First Lead', 'First Client')),
  clients TEXT[] DEFAULT '{}',
  liaison TEXT DEFAULT '' CHECK (liaison IN ('', 'MKB', 'Vincent', 'Andy', 'Sara', 'Melanie', 'Emily', 'Lorenzo', 'Vanessa', 'Martin')),
  next_action TEXT DEFAULT '',
  contract_signed BOOLEAN DEFAULT FALSE,
  engagement_type TEXT DEFAULT 'Unknown' CHECK (engagement_type IN ('Unknown', 'Hands Off', 'Open to Workshops', 'Open to Work', 'Open to be Staffed')),
  links JSONB DEFAULT '{}',
  last_contacted TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity logs table
CREATE TABLE activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professor_id UUID REFERENCES professors(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  entry TEXT NOT NULL,
  created_by TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_professors_status ON professors(status);
CREATE INDEX idx_professors_institution ON professors(institution);
CREATE INDEX idx_professors_liaison ON professors(liaison);
CREATE INDEX idx_professors_last_contacted ON professors(last_contacted);
CREATE INDEX idx_activity_logs_professor_id ON activity_logs(professor_id);
CREATE INDEX idx_activity_logs_date ON activity_logs(date);

-- Enable Row Level Security (but allow all operations for this team CRM)
ALTER TABLE professors ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (team-wide access)
CREATE POLICY "Allow all operations on professors" ON professors
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on activity_logs" ON activity_logs
  FOR ALL USING (true) WITH CHECK (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at on professors table
CREATE TRIGGER update_professors_updated_at
  BEFORE UPDATE ON professors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
