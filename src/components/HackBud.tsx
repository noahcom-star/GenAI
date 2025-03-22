'use client';

import { useState, useEffect } from 'react';
import { vapi } from '@/lib/vapi';

interface HackBudProps {
  hackathonId: string;
  onProfileComplete?: () => void;
}

export default function HackBud({ hackathonId, onProfileComplete }: HackBudProps) {
  const [callStatus, setCallStatus] = useState<'inactive' | 'loading' | 'active'>('inactive');
  const [error, setError] = useState<string | null>(null);

  const startCall = async () => {
    try {
      setCallStatus('loading');
      setError(null);

      await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!, {
        metadata: {
          hackathonId
        }
      });

      setCallStatus('active');
    } catch (err) {
      console.error('Error starting call:', err);
      setError('Failed to start call. Please try again.');
      setCallStatus('inactive');
    }
  };

  const stopCall = () => {
    try {
      vapi.stop();
      setCallStatus('inactive');
    } catch (err) {
      console.error('Error stopping call:', err);
      setError('Failed to stop call.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <div className="w-full bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        {callStatus === 'inactive' && (
          <button
            onClick={startCall}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Conversation
          </button>
        )}

        {callStatus === 'loading' && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span>Connecting...</span>
          </div>
        )}

        {callStatus === 'active' && (
          <>
            <div className="flex items-center gap-2 text-green-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span>Speaking with HackBud...</span>
            </div>
            <button
              onClick={stopCall}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              End Call
            </button>
          </>
        )}
      </div>

      {callStatus === 'active' && (
        <p className="text-sm text-gray-500 mt-2">
          Speak naturally about your skills, interests, and what you&apos;re looking for in a team.
        </p>
      )}
    </div>
  );
} 