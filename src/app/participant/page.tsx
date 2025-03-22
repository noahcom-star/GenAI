'use client';

import { useState } from 'react';
import HackBud from '@/components/HackBud';

export default function ParticipantPortal() {
  const [profileComplete, setProfileComplete] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Welcome to HackBud
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Talk to our AI assistant to create your profile and find your perfect hackathon team.
              Just click the button below to start the conversation.
            </p>
          </div>
          <div className="mt-5">
            <HackBud
              hackathonId="demo-hackathon"
              onProfileComplete={() => setProfileComplete(true)}
            />
          </div>
        </div>
      </div>

      {profileComplete && (
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Your Profile
            </h3>
            <div className="mt-5 border-t border-gray-200">
              <dl className="divide-y divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Profile Complete
                    </span>
                  </dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Next Steps</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                    We'll notify you when we find potential matches. You can also check the
                    "My Matches" page to see your current matches.
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 