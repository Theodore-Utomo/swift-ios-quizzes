import React, { useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstructorDashboard from './components/instructor/InstructorDashboard';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AuthCallback from './pages/auth/AuthCallback';
import HomePage from './pages/Home';
import CourseDetails from './pages/CourseDetails';
import QuizPage from './pages/Quiz';
import QuizResultsPage from './pages/QuizResults';
import ProgressPage from './components/ProgressPage';
import ErrorBoundary from './components/ErrorBoundary';
import { UserProvider } from './contexts/UserContext';
import { useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
  const { isAuthenticated, loading, login, logout } = useAuth();

  const handleLogin = useCallback(async (sessionToken: string) => {
    try {
      await login(sessionToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [login]);

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

  return (
    <Router>
      {isAuthenticated ? (
        <div className="flex flex-col min-h-screen">
          <Navbar onSignOut={logout} />
          <main className="flex-1">
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/instructor-panel" element={<InstructorDashboard />} />
              <Route path="/course/:courseId" element={<CourseDetails />} />
              <Route path="/courses/:courseId/quizzes/:quizId" element={<QuizPage />} />
              <Route path="/courses/:courseId/quizzes/:quizId/results" element={<QuizResultsPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </main>
          <Footer />
        </div>
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
    <ErrorBoundary>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
