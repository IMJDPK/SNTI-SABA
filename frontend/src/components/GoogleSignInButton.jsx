import { useEffect, useRef, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function GoogleSignInButton({ onSuccess, onError, text = 'signin_with' }) {
  const buttonRef = useRef(null);
  const [scriptReady, setScriptReady] = useState(Boolean(window.google?.accounts?.id));

  useEffect(() => {
    if (window.google?.accounts?.id) {
      setScriptReady(true);
      return;
    }

    const existing = document.querySelector('script[data-google-gsi="true"]');
    if (existing) {
      existing.addEventListener('load', () => setScriptReady(true));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = 'true';
    script.onload = () => setScriptReady(true);
    script.onerror = () => onError?.('Failed to load Google sign-in script.');
    document.body.appendChild(script);
  }, [onError]);

  useEffect(() => {
    if (!scriptReady || !buttonRef.current) return;
    if (!GOOGLE_CLIENT_ID) {
      onError?.('Missing VITE_GOOGLE_CLIENT_ID in frontend environment.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (resp) => {
        try {
          const res = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: resp.credential })
          });
          const raw = await res.text();
          let data = null;

          if (raw) {
            try {
              data = JSON.parse(raw);
            } catch {
              data = null;
            }
          }

          if (!res.ok || !data?.success) {
            throw new Error(data?.error || 'Google sign-in failed');
          }

          localStorage.setItem('userToken', data.token);
          localStorage.setItem('snti_user', JSON.stringify({ ...data.user, provider: 'google' }));
          window.dispatchEvent(new Event('storage'));

          onSuccess?.(data);
        } catch (err) {
          onError?.(err.message || 'Google sign-in failed');
        }
      }
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      text,
      width: 320,
      shape: 'pill'
    });
  }, [scriptReady, onError, onSuccess, text]);

  return <div ref={buttonRef} />;
}

export default GoogleSignInButton;
