-- Check if the table exists and show its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'hackathon_participants'
ORDER BY ordinal_position; 