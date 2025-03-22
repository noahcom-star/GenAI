import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const hackathonId = formData.get('hackathonId') as string;

    if (!file || !hackathonId) {
      return NextResponse.json(
        { error: 'File and hackathon ID are required' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    
    // Parse CSV
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    // Validate that we have an email column
    const csvColumns = Object.keys(records[0] || {});
    if (!csvColumns.includes('email')) {
      return NextResponse.json({
        error: 'CSV file must contain an email column'
      }, { status: 400 });
    }

    // Insert participants with just email addresses
    const { error } = await supabase
      .from('hackathon_participants')
      .insert(
        records.map((record: any) => ({
          hackathon_id: hackathonId,
          email: record.email,
          name: record.email.split('@')[0], // Use part before @ as name
          status: 'pending'
        }))
      );

    if (error) {
      console.error('Error inserting participants:', error);
      return NextResponse.json(
        { error: 'Failed to upload participants' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `Successfully uploaded ${records.length} participants`
    });
  } catch (err) {
    console.error('Error in participant upload:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 