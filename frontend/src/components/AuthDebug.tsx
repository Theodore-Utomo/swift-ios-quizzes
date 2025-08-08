import React, { useState } from 'react';

const AuthDebug: React.FC = () => {
  const stytchSession = localStorage.getItem('stytch_session');
  const userEmail = localStorage.getItem('user_email');
  const userRole = localStorage.getItem('user_role');
  const userId = localStorage.getItem('user_id');
  const stytchUserId = localStorage.getItem('stytch_user_id');
  const oldToken = localStorage.getItem('token');
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<null | { ok: boolean; status: number; body: unknown }>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleValidateSession = async () => {
    setValidating(true);
    setValidationError(null);
    setValidationResult(null);

    try {
      if (!apiUrl) {
        setValidationError('VITE_API_URL is not defined. Check your .env or environment.');
        return;
      }
      if (!stytchSession) {
        setValidationError('No stytch_session token in localStorage.');
        return;
      }

      const response = await fetch(`${apiUrl}/authenticate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: stytchSession }),
      });

      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        body = await response.text();
      }

      setValidationResult({ ok: response.ok, status: response.status, body });
    } catch (err: any) {
      setValidationError(err?.message ?? String(err));
    } finally {
      setValidating(false);
    }
  };

  const mask = (v: string | null) => (v ? `${v.slice(0, 6)}...${v.slice(-4)}` : '');

  return (
    <div style={{ padding: '16px', backgroundColor: '#f5f5f5', margin: '10px', border: '1px solid #ddd' }}>
      <h3>Authentication Debug Info</h3>
      <div style={{ fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.6 }}>
        <p><strong>Current Path:</strong> {typeof window !== 'undefined' ? window.location.pathname : ''}</p>
        <p><strong>VITE_API_URL:</strong> {apiUrl || '❌ Not set'}</p>
        <hr />
        <p><strong>stytch_session:</strong> {stytchSession ? `✅ Present (${mask(stytchSession)} | len=${stytchSession.length})` : '❌ Missing'}</p>
        <p><strong>user_email:</strong> {userEmail ? `✅ ${userEmail}` : '❌ Missing'}</p>
        <p><strong>user_role:</strong> {userRole ? `✅ ${userRole}` : '❌ Missing'}</p>
        <p><strong>user_id:</strong> {userId ? `✅ ${userId}` : '❌ Missing'}</p>
        <p><strong>stytch_user_id:</strong> {stytchUserId ? `✅ ${stytchUserId}` : '❌ Missing'}</p>
        <p><strong>old_token:</strong> {oldToken ? '✅ Present (legacy)' : '❌ Missing'}</p>
        <hr />
        <p><strong>Authentication Status:</strong> {stytchSession && userEmail ? '✅ Logged In (client)' : '❌ Not Logged In (client)'}</p>
        <div style={{ marginTop: 8 }}>
          <button onClick={handleValidateSession} disabled={validating} style={{ padding: '6px 10px', background: '#2563eb', color: 'white', borderRadius: 4 }}>
            {validating ? 'Validating…' : 'Validate Session with Backend'}
          </button>
        </div>
        {validationError && (
          <div style={{ color: '#b91c1c', marginTop: 8 }}>
            <strong>Validation Error:</strong> {validationError}
          </div>
        )}
        {validationResult && (
          <div style={{ marginTop: 8 }}>
            <strong>Validation Result:</strong>
            <pre style={{ background: '#fff', padding: 8, border: '1px solid #ddd', overflowX: 'auto' }}>
{JSON.stringify(validationResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 