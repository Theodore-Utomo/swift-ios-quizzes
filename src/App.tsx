import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuizList from './components/QuizList';
import QuizPage from './components/QuizPage';
import Navbar from './components/Navbar';

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

  // Fetch quiz data from the API
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/quizzes');
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

    fetchQuizzes();
  }, []);

  if (loading) {
    return <p>Loading quizzes...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/quizzes" element={<QuizList quizzes={quizzes} />} />
        <Route path="/quizzes/:id" element={<QuizPage />} />
      </Routes>
    </Router>
  );
}

export default App;