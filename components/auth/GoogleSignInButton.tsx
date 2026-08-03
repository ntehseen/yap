import React from 'react';
import { Button } from '@/components/ui/button';
import handleGoogleSignIn from '@/util/handleGoogleSignIn';

interface Props {
  listeners: Array<() => void>;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  loading?: boolean;
}

function GoogleSignInButton({
  listeners,
  setIsSubmit,
  setError,
  setLoading,
  loading = false,
}: Props) {
  return (
    <Button
      type="button"
      variant="outline"
      className="mb-6 w-full gap-2 border-border bg-card text-foreground hover:bg-muted"
      disabled={loading}
      onClick={() =>
        handleGoogleSignIn({
          listeners,
          setIsSubmit,
          setError,
          setLoading,
        })
      }
    >
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4">
        <path
          fill="#EA4335"
          d="M12 10.2v3.6h5.1c-.2 1.2-1.5 3.6-5.1 3.6-3.1 0-5.6-2.5-5.6-5.6S8.9 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.8 14.6 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.5H12z"
        />
        <path
          fill="#34A853"
          d="M3.9 7.4l3 2.2C7.8 7.5 9.7 6.2 12 6.2c1.8 0 3 .7 3.7 1.4l2.5-2.4C16.8 3.8 14.6 3 12 3 8.3 3 5.1 5.1 3.9 7.4z"
        />
        <path
          fill="#4A90E2"
          d="M12 21c2.5 0 4.7-.8 6.2-2.2l-3-2.4c-.8.6-1.9 1-3.2 1-3.5 0-6.4-2.4-7.4-5.6l-3 2.3C3.1 18.1 7.1 21 12 21z"
        />
        <path
          fill="#FBBC05"
          d="M4.6 14.8c-.2-.6-.4-1.2-.4-1.8s.1-1.2.4-1.8l-3-2.3C1.2 10.3 1 11.1 1 12s.2 1.7.6 2.5l3-2.3z"
        />
      </svg>
      {loading ? 'Connecting…' : 'Continue with Google'}
    </Button>
  );
}

export default GoogleSignInButton;
