"use client";

import Image from 'next/image';

interface SignInWithGoogleProps {
  onSignIn: () => void;
}

export default function SignInWithGoogle({ onSignIn }: SignInWithGoogleProps) {
  return (
    <button
      onClick={onSignIn}
      className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
    >
      <Image
        src="/google-logo.svg"
        alt="Google logo"
        width={20}
        height={20}
      />
      Sign in with Google
    </button>
  );
}
