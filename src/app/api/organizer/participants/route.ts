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
    const { searchParams } = new URL(request.url);
    const hackathonId = searchParams.get('hackathonId');

    if (!hackathonId) {
      return NextResponse.json(
        { error: 'Hackathon ID is required' },
        { status: 400 }
      );
    }

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

    // Verify the hackathon belongs to the organizer
    const { data: hackathon } = await supabase
      .from('hackathons')
      .select('id')
      .eq('id', hackathonId)
      .eq('organizer_id', organizer.id)
      .single();

    if (!hackathon) {
      return NextResponse.json(
        { error: 'Hackathon not found or access denied' },
        { status: 404 }
      );
    }

    // Get the participants
    const { data: participants, error } = await supabase
      .from('hackathon_participants')
      .select('id, email, status')
      .eq('hackathon_id', hackathonId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching participants:', error);
      return NextResponse.json(
        { error: 'Failed to fetch participants' },
        { status: 500 }
      );
    }

    return NextResponse.json(participants || []);
  } catch (err) {
    console.error('Error in participants fetch:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 