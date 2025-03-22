-- Drop the table first to ensure a clean state
DROP TABLE IF EXISTS hackathon_participants CASCADE;

-- Create hackathon_participants table
CREATE TABLE hackathon_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'declined')),
  skills TEXT[],
  interests TEXT[],
  role TEXT,
  UNIQUE(email, hackathon_id)
); 