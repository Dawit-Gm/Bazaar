import { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import LoginModal from './LoginModal';

const TawkTo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);

  const statusRef = useRef(status);
  statusRef.current = status;

  // Inject tawk.to once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (document.getElementById('tawk-to-script')) return;

    const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
    const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

    if (!propertyId || !widgetId) {
      console.warn('TawkTo: Missing env vars');
      return;
    }

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Pre-fill visitor info when widget loads
    window.Tawk_API.onLoad = function () {
      if (session?.user && window.Tawk_API.setAttributes) {
        window.Tawk_API.setAttributes({
          name: session.user.name || 'Bazaar Customer',
          email: session.user.email || '',
        });
      }
    };

    // Guest clicks chat bubble → minimize and show login modal
    window.Tawk_API.onChatMaximized = function () {
      if (statusRef.current !== 'authenticated') {
        if (window.Tawk_API.minimize) {
          window.Tawk_API.minimize();
        }
        setShowLogin(true);
      }
    };

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
  }, []); // Load once

  // Update tawk.to visitor info when user logs in after script is loaded
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (status !== 'authenticated') return;
    if (!window.Tawk_API?.setAttributes) return;

    window.Tawk_API.setAttributes({
      name: session.user.name || 'Bazaar Customer',
      email: session.user.email || '',
    });
  }, [status, session]);

  return (
    <>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default TawkTo;