import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from '../components/quiz/QuizComponent';
import { Quiz } from '../types/quiz';
import { apiService } from "../services/api";

const QuizPage: React.FC = () => {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiService.getQuiz(courseId!, quizId!);
        setQuiz(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [courseId, quizId]);

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div>
      <QuizComponent quiz={quiz} />
    </div>
  );
};

export default QuizPage;