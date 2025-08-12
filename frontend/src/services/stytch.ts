export interface StytchAuthResponse {
  stytch_user_id?: string;
  user_id: string;
  email: string;
  role: string;
  session_token: string;
}

export interface StytchMessageResponse {
  message: string;
  email?: string;
  stytch_user_id?: string;
}

export class StytchService {
  private static instance: StytchService;
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
  }

  static getInstance(): StytchService {
    if (!StytchService.instance) {
      StytchService.instance = new StytchService();
    }
    return StytchService.instance;
  }

  // Send magic link to user's email
  async sendMagicLink(email: string): Promise<StytchMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        let detail = 'Failed to send magic link';
        try {
          const err = await response.json();
          detail = err?.detail || err?.message || detail;
        } catch {}
        throw new Error(detail);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending magic link:', error);
      throw error;
    }
  }

  // Verify magic link token
  async verifyMagicLink(token: string): Promise<StytchAuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        let detail = 'Failed to verify magic link';
        try {
          const err = await response.json();
          detail = err?.detail || err?.message || detail;
        } catch {}
        throw new Error(detail);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying magic link:', error);
      throw error;
    }
  }

  // Authenticate session token
  async authenticateSession(sessionToken: string): Promise<StytchAuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/authenticate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_token: sessionToken }),
      });

      if (!response.ok) {
        let detail = 'Failed to authenticate session';
        try {
          const err = await response.json();
          detail = err?.detail || err?.message || detail;
        } catch {}
        throw new Error(detail);
      }

      return await response.json();
    } catch (error) {
      console.error('Error authenticating session:', error);
      throw error;
    }
  }

  // Logout user
  async logout(sessionToken: string): Promise<StytchMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_token: sessionToken }),
      });

      if (!response.ok) {
        let detail = 'Failed to logout';
        try {
          const err = await response.json();
          detail = err?.detail || err?.message || detail;
        } catch {}
        throw new Error(detail);
      }

      return await response.json();
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Register new user
  async registerUser(email: string, role: string = 'student'): Promise<StytchMessageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, role }),
      });

      if (!response.ok) {
        let detail = 'Failed to register user';
        try {
          const err = await response.json();
          detail = err?.detail || err?.message || detail;
        } catch {}
        throw new Error(detail);
      }

      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const sessionToken = localStorage.getItem('stytch_session');
    return !!sessionToken;
  }

  // Get current user info
  getCurrentUser(): { email: string; role: string; user_id: string } | null {
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');
    const user_id = localStorage.getItem('user_id');
    
    if (email && role && user_id) {
      return { email, role, user_id };
    }
    
    return null;
  }

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem('stytch_session');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
  }
}

export default StytchService.getInstance(); 