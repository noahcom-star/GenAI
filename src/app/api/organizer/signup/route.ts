import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Check if organizer already exists
    const { data: existingOrganizer } = await supabase
      .from('organizers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingOrganizer) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create organizer
    const { data: organizer, error: organizerError } = await supabase
      .from('organizers')
      .insert([
        {
          email: email.toLowerCase(),
          password: hashedPassword,
          name
        }
      ])
      .select()
      .single();

    if (organizerError) {
      console.error('Error creating organizer:', organizerError);
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }

    // Set cookie with organizer's email
    const cookieStore = cookies();
    cookieStore.set('organizer_email', email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return NextResponse.json({
      message: 'Account created successfully',
      organizer: {
        id: organizer.id,
        email: organizer.email,
        name: organizer.name
      }
    });
  } catch (err) {
    console.error('Error in signup:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 