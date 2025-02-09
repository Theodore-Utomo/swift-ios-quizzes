import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import QuizList from './components/QuizList';
import QuizPage from './components/QuizPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';

interface Question {
  question_number: number;
  question_type: 'MCQ' | 'MCQ_more_than_one' | 'Short_answer';
  question_text: string;
  question_options: string[];
  question_answer: string | string[];
}

interface Quiz {
  id: number;
  name: string;
  content: Question[];
}

function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = (): boolean => {
    return !!localStorage.getItem('token'); // Check if the token exists in localStorage
  };

  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/quizzes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Send token with request
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
    if (isLoggedIn()) {
      fetchQuizzes();
    } else {
      setLoading(false); // Stop loading if the user is not logged in
    }
  }, []);

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <Router>
      {isLoggedIn() ? (
        <>
          <Navbar />
          <Routes>
            <Route path="/quizzes" element={<QuizList quizzes={quizzes} />} />
            <Route path="/quizzes/:id" element={<QuizPage />} />
            <Route path="*" element={<Navigate to="/quizzes" />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
