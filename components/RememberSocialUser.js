import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function RememberSocialUser() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.provider === 'google') {
      localStorage.setItem('bazaar_last_google_user', JSON.stringify({
        name: session.user.name,
        email: session.user.email,
        picture: session.user.picture,
      }));
    }
  }, [session]);

  return null;
}