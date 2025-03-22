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
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get organizer by email
    const { data: organizer, error } = await supabase
      .from('organizers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !organizer) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, organizer.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Get associated hackathon
    const { data: hackathon } = await supabase
      .from('hackathons')
      .select('*')
      .eq('organizer_id', organizer.id)
      .single();

    // Set cookie with organizer's email
    const cookieStore = cookies();
    cookieStore.set('organizer_email', email.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // If no hackathon exists, redirect to create one
    const redirectUrl = hackathon ? '/organizer/dashboard' : '/organizer/create-hackathon';

    return NextResponse.json({
      message: 'Login successful',
      redirectUrl,
      organizer: {
        id: organizer.id,
        email: organizer.email,
        name: organizer.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 