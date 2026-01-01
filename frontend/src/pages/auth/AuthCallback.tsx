import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import stytchService from '../../services/stytch';

interface AuthCallbackProps {
  onLogin: (token: string) => void;
}

const AuthCallback: React.FC<AuthCallbackProps> = ({ onLogin }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasRunRef = useRef(false);
  const processingTokensRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setError('No token found in URL');
        setLoading(false);
        return;
      }

      try {
        const data = await stytchService.verifyMagicLink(token);

        if (!data.session_token) {
          setError('Verification succeeded but no session token was returned by the server.');
          setLoading(false);
          return;
        }

        // Store the session token and user data
        localStorage.setItem('stytch_session', data.session_token);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_id', data.user_id);
        if (data.stytch_user_id) {
          localStorage.setItem('stytch_user_id', data.stytch_user_id);
        }

        // Call the login handler
        onLogin(data.session_token);

        // Replace history so a refresh doesn't reuse the one-time token
        navigate('/home', { replace: true });
      } catch (err: any) {
        const errorMessage = err?.message || 'Authentication failed. Please try again.';
        console.error('[AuthCallback] Error verifying magic link:', errorMessage);

        const isTokenAlreadyUsed = errorMessage.toLowerCase().includes('already used') ||
          errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('unable_to_auth_magic_link');

        if (!isTokenAlreadyUsed) {
          // For other errors, allow retry by clearing the processed flag
          processingTokensRef.current.delete(token);
          const processedKey = `auth_token_processed_${token}`;
          sessionStorage.removeItem(processedKey);
          hasRunRef.current = false;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    handleCallback();

  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback; 