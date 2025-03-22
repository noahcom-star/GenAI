'use client';

import { useState } from 'react';
import { vapi } from '@/lib/vapi';

interface HackBudProps {
  hackathonId: string;
  onProfileComplete?: () => void;
}

export default function HackBud({ hackathonId, onProfileComplete }: HackBudProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const handleSendMessage = async (message: string) => {
    try {
      setIsTyping(true);
      const response = await vapi.chat(message);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Chat with HackBud
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Let&apos;s find you the perfect team! Tell me about your skills and interests.
          </p>
        </div>
        {/* Chat messages will go here */}
      </div>
    </div>
  );
} 