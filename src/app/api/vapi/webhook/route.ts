import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Extract relevant information from Vapi's webhook
    const {
      conversation_id,
      message,
      speaker,
      timestamp
    } = data;

    // Get participant email from cookie
    const cookieStore = cookies();
    const participantEmail = cookieStore.get('participant_email')?.value;

    if (!participantEmail) {
      console.error('No participant email found in cookie');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get participant ID from email
    const { data: participant, error: participantError } = await supabase
      .from('hackathon_participants')
      .select('id')
      .eq('email', participantEmail)
      .single();

    if (participantError || !participant) {
      console.error('Participant not found:', participantError);
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Store the message in our database
    const { error } = await supabase
      .from('conversations')
      .insert({
        conversation_id,
        message,
        speaker,
        timestamp: new Date(timestamp).toISOString(),
        participant_id: participant.id
      });

    if (error) {
      console.error('Error storing message:', error);
      return NextResponse.json({ error: 'Failed to store message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 