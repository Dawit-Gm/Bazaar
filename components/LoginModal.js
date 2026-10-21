import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function LoginModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [facebookUser, setFacebookUser] = useState(null);
  const [lastGoogleUser, setLastGoogleUser] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  // Load last-used Google account from localStorage
  useEffect(() => {
    if (!isOpen) return;
    try {
      const saved = localStorage.getItem('bazaar_last_google_user');
      if (saved) setLastGoogleUser(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, [isOpen]);

  // Initialize Google One Tap + Facebook detection when modal opens
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;

    // ── Google Identity Services: One Tap ──
    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: (response) => {
          // GIS returned a JWT credential — for now, fall back to standard OAuth
          // because NextAuth v4 GoogleProvider uses OAuth, not GIS JWT
          signIn('google', { callbackUrl: window.location.href });
        },
        auto_select: false,
        cancel_on_tap_outside: false,
      });

      // Prompt One Tap — this shows the native "Sign in as [Name]" card at top-right
      window.google.accounts.id.prompt((notification) => {
        // notification tells us if it displayed or not
        // we don't need to handle it — the UI appears automatically
      });
    };

    // ── Facebook SDK: detect logged-in user ──
    const initFacebook = () => {
      if (window.FB) {
        FB.getLoginStatus((response) => {
          if (response.status === 'connected') {
            FB.api('/me', { fields: 'name,picture' }, (userInfo) => {
              if (userInfo && !userInfo.error) {
                setFacebookUser(userInfo);
              }
            });
          }
        });
      } else if (!document.getElementById('fb-sdk-script')) {
        window.fbAsyncInit = function () {
          FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
            cookie: true,
            xfbml: true,
            version: 'v18.0',
          });
          FB.getLoginStatus((response) => {
            if (response.status === 'connected') {
              FB.api('/me', { fields: 'name,picture' }, (userInfo) => {
                if (userInfo && !userInfo.error) setFacebookUser(userInfo);
              });
            }
          });
        };

        const script = document.createElement('script');
        script.id = 'fb-sdk-script';
        script.src = 'https://connect.facebook.net/en_US/sdk.js';
        script.async = true;
        script.defer = true;
        script.crossOrigin = 'anonymous';
        document.body.appendChild(script);
      }
    };

    // Small delay so GIS script (loaded in _app.js) is ready
    const timer = setTimeout(() => {
      initGoogle();
      initFacebook();
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const submitHandler = async ({ email, password }) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Logged in successfully!');
        onClose();
        window.location.reload();
      }
    } catch (err) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // Remember that user chose Google (we'll store name after successful login)
    signIn('google', { callbackUrl: window.location.href });
  };

  return (
    <div
      className="fixed inset-0 z-[999999999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl leading-none"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-center text-gray-900 mb-1">
          Sign in to continue
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          Choose an account to chat with us
        </p>

        {/* ── Google: "Sign in as [Name]" card if remembered, else standard ── */}
        {lastGoogleUser ? (
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center gap-3 bg-white border border-gray-200 hover:border-green-400 hover:shadow-md text-gray-800 py-3 px-4 rounded-xl transition mb-3"
          >
            <img
              src={lastGoogleUser.picture || 'https://via.placeholder.com/40'}
              alt={lastGoogleUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="text-left">
              <div className="font-semibold text-sm">Sign in as {lastGoogleUser.name}</div>
              <div className="text-xs text-gray-400">{lastGoogleUser.email}</div>
            </div>
            <span className="ml-auto text-gray-300">→</span>
          </button>
        ) : (
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center gap-3 bg-white border-2 border-gray-100 hover:border-green-400 hover:bg-green-50 text-gray-800 py-3 px-4 rounded-xl transition shadow-sm mb-3"
          >
            <div className="w-10 h-10 bg-white rounded-full border border-gray-100 flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Sign in with Google</div>
              <div className="text-xs text-gray-400">Use your Google account</div>
            </div>
            <span className="ml-auto text-gray-300">→</span>
          </button>
        )}

        {/* ── Facebook: "Continue as [Name]" if detected ── */}
        {facebookUser ? (
          <button
            onClick={() => signIn('facebook', { callbackUrl: window.location.href })}
            className="w-full flex items-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-3 px-4 rounded-xl transition shadow-sm mb-4"
          >
            <img
              src={facebookUser.picture?.data?.url || 'https://via.placeholder.com/40'}
              alt={facebookUser.name}
              className="w-10 h-10 rounded-full border-2 border-white/30"
            />
            <div className="text-left">
              <div className="font-semibold text-sm">Continue as {facebookUser.name}</div>
              <div className="text-xs text-blue-100">Facebook</div>
            </div>
            <span className="ml-auto text-blue-200">→</span>
          </button>
        ) : (
          <button
            onClick={() => signIn('facebook', { callbackUrl: window.location.href })}
            className="w-full flex items-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white py-3 px-4 rounded-xl transition shadow-sm mb-4"
          >
            <div className="w-10 h-10 bg-[#166fe5] rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">Sign in with Facebook</div>
              <div className="text-xs text-blue-100">Use your Facebook account</div>
            </div>
            <span className="ml-auto text-blue-200">→</span>
          </button>
        )}

        {/* Toggle email form */}
        {!showEmailForm ? (
          <button
            onClick={() => setShowEmailForm(true)}
            className="w-full text-center text-sm text-gray-500 hover:text-gray-800 py-2 transition"
          >
            Or use email / password →
          </button>
        ) : (
          <>
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">Email login</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(submitHandler)} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Please enter email',
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                      message: 'Please enter valid email',
                    },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Please enter password',
                    minLength: { value: 6, message: 'Password must be more than 5 chars' },
                  })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-3">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-green-600 hover:underline font-medium">
                Register
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}