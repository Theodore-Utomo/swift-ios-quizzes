import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from '../components/QuizComponent';
import { Quiz } from '../types';

const QuizPage: React.FC = () => {
    const { classId, quizId } = useParams<{ classId: string; quizId: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/classes/${classId}/quizzes/${quizId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quiz');
                }
                const data: Quiz = await response.json();
                setQuiz(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [classId, quizId]);

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
