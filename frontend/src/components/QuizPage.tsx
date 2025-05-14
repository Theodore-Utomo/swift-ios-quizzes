import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuizComponent from '../components/QuizComponent';
import { Quiz } from '../types';
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string; // this holds the username as set in your access token payload
  role?: string;
  // add other fields if needed
}

const QuizPage: React.FC = () => {
    const { classId, quizId } = useParams<{ classId: string; quizId: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Retrieve token from localStorage
    const token = localStorage.getItem("token");

    // Decode the token to extract the username
    let username: string | null = null;
    if (token) {
        try {
            const decoded = jwtDecode<TokenPayload>(token);
            username = decoded.sub;
        } catch (err) {
            console.error("Error decoding token", err);
        }
    }

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`https://swift-ios-quizzes-backend.onrender.com/classes/${classId}/quizzes/${quizId}`);
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
    if (!username) return <p>User not logged in.</p>;

    return (
        <div>
            <QuizComponent quiz={quiz} username={username} />
        </div>
    );
};

export default QuizPage;
