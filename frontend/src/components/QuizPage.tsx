import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from '../components/QuizComponent';
import { Quiz } from '../types';
import { API_URL } from "../services/api";

const QuizPage: React.FC = () => {
    const { classId, quizId } = useParams<{ classId: string; quizId: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get user email from localStorage (new Stytch system)
    const userEmail = localStorage.getItem("user_email");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${API_URL}/classes/${classId}/quizzes/${quizId}`);
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
    if (!userEmail) return <p>User not logged in.</p>;

    return (
        <div>
            <QuizComponent quiz={quiz} username={userEmail} />
        </div>
    );
};

export default QuizPage;
