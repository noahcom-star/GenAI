-- Drop existing indexes first
DROP INDEX IF EXISTS idx_hackathon_participants_hackathon_id;
DROP INDEX IF EXISTS idx_hackathon_participants_email;

-- Create indexes
CREATE INDEX idx_hackathon_participants_hackathon_id 
  ON hackathon_participants(hackathon_id);

CREATE INDEX idx_hackathon_participants_email 
  ON hackathon_participants(email); 