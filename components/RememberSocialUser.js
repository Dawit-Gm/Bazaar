import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function RememberSocialUser() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const { name, email } = session.user;
      
      // Detect which provider was used from the account object
      // NextAuth doesn't expose provider on session directly in v4,
      // so we infer from how the user was created or store a flag
      // For now, we just save the user info generically
      const saved = {
        name: name || '',
        email: email || '',
        lastLoginAt: new Date().toISOString(),
      };
      
      localStorage.setItem('bazaar_last_user', JSON.stringify(saved));
    }
  }, [session, status]);

  return null;
}