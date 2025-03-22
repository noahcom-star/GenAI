import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: Request) {
  try {
    // Get the organizer's email from the session
    const cookieStore = cookies();
    const email = cookieStore.get('organizer_email')?.value;

    if (!email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the organizer's ID
    const { data: organizer } = await supabase
      .from('organizers')
      .select('id')
      .eq('email', email)
      .single();

    if (!organizer) {
      return NextResponse.json(
        { error: 'Organizer not found' },
        { status: 404 }
      );
    }

    // Get all hackathons for the organizer
    const { data: hackathons, error } = await supabase
      .from('hackathons')
      .select('id, name, status, description, start_date, end_date, max_participants')
      .eq('organizer_id', organizer.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching hackathons:', error);
      return NextResponse.json(
        { error: 'Failed to fetch hackathons' },
        { status: 500 }
      );
    }

    return NextResponse.json(hackathons || []);
  } catch (err) {
    console.error('Error in hackathon fetch:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 