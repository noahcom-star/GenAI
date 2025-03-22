-- Add RLS policies for hackathon_participants
ALTER TABLE hackathon_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Organizers can read own hackathon participants" ON hackathon_participants;
DROP POLICY IF EXISTS "Organizers can update own hackathon participants" ON hackathon_participants;
DROP POLICY IF EXISTS "Participants can read own data" ON hackathon_participants;
DROP POLICY IF EXISTS "Participants can update own data" ON hackathon_participants;

CREATE POLICY "Organizers can read own hackathon participants" ON hackathon_participants
  FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM hackathons
    WHERE id = hackathon_participants.hackathon_id
    AND organizer_id::text = auth.uid()::text
  ));

CREATE POLICY "Organizers can update own hackathon participants" ON hackathon_participants
  FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM hackathons
    WHERE id = hackathon_participants.hackathon_id
    AND organizer_id::text = auth.uid()::text
  ));

CREATE POLICY "Participants can read own data" ON hackathon_participants
  FOR SELECT
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Participants can update own data" ON hackathon_participants
  FOR UPDATE
  USING (email = auth.jwt() ->> 'email'); 