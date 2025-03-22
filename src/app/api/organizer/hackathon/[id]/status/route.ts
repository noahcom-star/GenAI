import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const hackathonId = params.id;
    const { status } = await request.json();

    if (!status || !['draft', 'active', 'completed', 'cancelled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
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

    // Update the hackathon status
    const { error } = await supabase
      .from('hackathons')
      .update({ status })
      .eq('id', hackathonId)
      .eq('organizer_id', organizer.id);

    if (error) {
      console.error('Error updating hackathon status:', error);
      return NextResponse.json(
        { error: 'Failed to update status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (err) {
    console.error('Error in status update:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 