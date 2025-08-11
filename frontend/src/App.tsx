import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import Navbar from './components/layout/Navbar';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';
import HomePage from './pages/Home';
import ClassDetails from './pages/ClassDetails';
import QuizPage from './pages/Quiz';
import ProgressPage from './components/ProgressPage';
import { UserProvider } from './contexts/UserContext';
import { useAuth } from './hooks/useAuth';

// App content component that uses the UserContext
const AppContent: React.FC = () => {
  const { isAuthenticated, loading, login, logout } = useAuth();

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

  const handleLogin = async (sessionToken: string) => {
    try {
      await login(sessionToken);
    } catch (error) {
      console.error('Login failed:', error);
      // The error will be handled by the login components
      throw error;
    }
  };

  return (
    <Router>
      {isAuthenticated ? (
        <>
          <Navbar onSignOut={logout} />
          <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/instructor-panel" element={<InstructorDashboard />} />
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
};

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
