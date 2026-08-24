import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const TawkTo = () => {
  const { data: session } = useSession();

  useEffect(() => {
    // Only run in browser, skip during server-side rendering
    if (typeof window === 'undefined') return;

    // Prevent double-loading if script already exists
    if (document.getElementById('tawk-to-script')) return;

    const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

    if (!propertyId || !widgetId) {
      console.warn('TawkTo: Missing Property ID or Widget ID in environment variables');
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // If user is logged in, pre-fill their info in the chat
    if (session?.user) {
      window.Tawk_API.visitor = {
        name: session.user.name || 'Bazaar Customer',
        email: session.user.email || '',
      };
    }

    const script = document.createElement('script');
    script.id = 'tawk-to-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript);

    return () => {
      const existing = document.getElementById('tawk-to-script');
      if (existing) existing.remove();
    };
  }, [session]); // Re-run if login/logout happens

  return null;
};

export default TawkTo;