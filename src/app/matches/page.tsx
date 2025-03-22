'use client';

import { useState, useEffect } from 'react';

interface Match {
  id: string;
  name: string;
  role: string;
  skills: string[];
  compatibility: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch('/api/matches');
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await response.json();
        setMatches(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleMatchResponse = async (matchId: string, accept: boolean) => {
    try {
      const response = await fetch('/api/matches/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ matchId, accept }),
      });

      if (!response.ok) {
        throw new Error('Failed to update match status');
      }

      setMatches(matches.map(match => 
        match.id === matchId 
          ? { ...match, status: accept ? 'accepted' : 'rejected' }
          : match
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update match');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Your Matches</h2>
      
      {matches.length === 0 ? (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              No matches yet
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Here&apos;s what we found based on your profile and preferences.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {matches.map((match) => (
            <div key={match.id} className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {match.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{match.role}</p>
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      {Math.round(match.compatibility * 100)}% Match
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {match.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {match.status === 'pending' && (
                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => handleMatchResponse(match.id, true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Accept Match
                    </button>
                    <button
                      onClick={() => handleMatchResponse(match.id, false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {match.status === 'accepted' && (
                  <div className="mt-6">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Accepted
                    </span>
                  </div>
                )}

                {match.status === 'rejected' && (
                  <div className="mt-6">
                    <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                      Declined
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 