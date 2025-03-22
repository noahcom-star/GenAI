-- Drop existing hackathons table if it exists
DROP TABLE IF EXISTS hackathons;

-- Recreate hackathons table with all required columns
CREATE TABLE hackathons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_participants INTEGER NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
    organizer_id UUID NOT NULL REFERENCES organizers(id) ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX hackathons_organizer_id_idx ON hackathons(organizer_id);
CREATE INDEX hackathons_status_idx ON hackathons(status);

-- Enable Row Level Security
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow organizers to view their own hackathons
CREATE POLICY "Organizers can view their own hackathons"
    ON hackathons
    FOR SELECT
    USING (organizer_id = auth.uid());

-- Create policy to allow organizers to insert their own hackathons
CREATE POLICY "Organizers can insert their own hackathons"
    ON hackathons
    FOR INSERT
    WITH CHECK (organizer_id = auth.uid());

-- Create policy to allow organizers to update their own hackathons
CREATE POLICY "Organizers can update their own hackathons"
    ON hackathons
    FOR UPDATE
    USING (organizer_id = auth.uid());

-- Create policy to allow organizers to delete their own hackathons
CREATE POLICY "Organizers can delete their own hackathons"
    ON hackathons
    FOR DELETE
    USING (organizer_id = auth.uid()); 