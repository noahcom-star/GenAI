-- Drop existing table if it exists
DROP TABLE IF EXISTS conversations;

-- Create conversations table
CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    conversation_id TEXT NOT NULL,
    message TEXT NOT NULL,
    speaker TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    participant_id UUID REFERENCES hackathon_participants(id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX idx_conversations_conversation_id ON conversations(conversation_id);
CREATE INDEX idx_conversations_participant_id ON conversations(participant_id);

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can insert conversations"
    ON conversations FOR INSERT
    WITH CHECK (true);  -- Allow service role to insert

CREATE POLICY "Organizers can view conversations for their hackathon participants"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM hackathon_participants hp
            JOIN hackathons h ON hp.hackathon_id = h.id
            WHERE hp.id = conversations.participant_id
            AND h.organizer_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Participants can view their own conversations"
    ON conversations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM hackathon_participants hp
            WHERE hp.id = conversations.participant_id
            AND hp.email = auth.jwt() ->> 'email'
        )
    ); 