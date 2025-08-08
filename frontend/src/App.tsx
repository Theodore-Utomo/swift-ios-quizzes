import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstructorPanel from './components/InstructorPanel';
import Navbar from './components/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';
import HomePage from './components/HomePage';
import ClassDetails from './components/ClassDetails';
import QuizPage from './components/QuizPage';
import ProgressPage from './components/ProgressPage';
import stytchService from './services/stytch';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Validate session on app load
  useEffect(() => {
    const validateSession = async () => {
      const sessionToken = localStorage.getItem('stytch_session');
      
      if (!sessionToken) {
        setLoading(false);
        return;
      }

      try {
        // Validate the session with the backend
        const data = await stytchService.authenticateSession(sessionToken);
        
        // Update localStorage with fresh data
        localStorage.setItem('stytch_session', data.session_token);
        localStorage.setItem('user_email', data.email);
        localStorage.setItem('user_role', data.role);
        localStorage.setItem('user_id', data.user_id);
        if (data.stytch_user_id) {
          localStorage.setItem('stytch_user_id', data.stytch_user_id);
        }
        
        setIsLoggedIn(true);
      } catch (err) {
        console.error('Session validation failed:', err);
        // Clear invalid session data
        localStorage.removeItem('stytch_session');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_id');
        localStorage.removeItem('stytch_user_id');
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('stytch_session');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('stytch_user_id');
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleLogin = (sessionToken: string) => {
    // Store the Stytch session token
    localStorage.setItem('stytch_session', sessionToken);
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar onSignOut={handleSignOut} />
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/instructor-panel" element={<InstructorPanel />} />
            <Route path="/class/:classId" element={<ClassDetails />} />
            <Route path="/classes/:classId/quizzes/:quizId" element={<QuizPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
