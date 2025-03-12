import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import InstructorPanel from './components/Instructor';
import QuizList from './components/QuizList';
import QuizPage from './components/QuizPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import { Quiz} from './types'


function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!localStorage.getItem('token'));

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/quizzes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }

      const data: Quiz[] = await response.json();
      setQuizzes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchQuizzes();
    }
  }, [isLoggedIn]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  const handleLogin = (token: string) => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <>
          <Navbar onSignOut={handleSignOut} />
          <Routes>
            <Route path="/instructor-panel" element={<InstructorPanel/>} />
            <Route path="/quizzes" element={<QuizList quizzes={quizzes} />} />
            <Route path="/quizzes/:id" element={<QuizPage />} />
            <Route path="*" element={<Navigate to="/quizzes" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
