import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, startDate, endDate, description, maxParticipants } = await request.json();

    console.log('Received data:', { name, startDate, endDate, description, maxParticipants });

    // Validate required fields
    if (!name || !startDate || !endDate || !description || !maxParticipants) {
      const missingFields = [];
      if (!name) missingFields.push('name');
      if (!startDate) missingFields.push('startDate');
      if (!endDate) missingFields.push('endDate');
      if (!description) missingFields.push('description');
      if (!maxParticipants) missingFields.push('maxParticipants');

      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return NextResponse.json(
        { error: 'Start date must be in the future' },
        { status: 400 }
      );
    }

    if (end <= start) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    // Get the organizer's email from the session
    const cookieStore = cookies();
    const email = cookieStore.get('organizer_email')?.value;

    console.log('Organizer email from cookie:', email);

    if (!email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get the organizer's ID
    const { data: organizer, error: organizerError } = await supabase
      .from('organizers')
      .select('id')
      .eq('email', email)
      .single();

    if (organizerError) {
      console.error('Error fetching organizer:', organizerError);
      return NextResponse.json(
        { error: 'Failed to fetch organizer details' },
        { status: 500 }
      );
    }

    if (!organizer) {
      return NextResponse.json(
        { error: 'Organizer not found' },
        { status: 404 }
      );
    }

    console.log('Found organizer:', organizer);

    // Create hackathon
    const { data: hackathon, error: hackathonError } = await supabase
      .from('hackathons')
      .insert([
        {
          name,
          start_date: startDate,
          end_date: endDate,
          description,
          max_participants: parseInt(maxParticipants),
          status: 'draft',
          organizer_id: organizer.id
        }
      ])
      .select()
      .single();

    if (hackathonError) {
      console.error('Error creating hackathon:', hackathonError);
      return NextResponse.json(
        { error: `Failed to create hackathon: ${hackathonError.message}` },
        { status: 500 }
      );
    }

    console.log('Created hackathon:', hackathon);

    return NextResponse.json({
      message: 'Hackathon created successfully',
      hackathon
    });
  } catch (err) {
    console.error('Error in hackathon creation:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 