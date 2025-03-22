import Vapi from '@vapi-ai/web';

// Initialize Vapi client
export const vapi = new Vapi({
  apiKey: process.env.NEXT_PUBLIC_VAPI_API_KEY!,
}); 