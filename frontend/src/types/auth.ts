/**
 * Authentication-related types
 */

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LoginProps {
  onLogin: (token: string) => void;
}

export interface AuthRequest {
  session_token: string;
}
