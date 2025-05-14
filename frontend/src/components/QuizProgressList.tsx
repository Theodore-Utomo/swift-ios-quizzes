import React, { useState, useEffect } from 'react';
import "./../styles/QuizProgressList.css";

// Add quiz_name to the interface
export interface QuizProgress {
  quiz_id?: string;
  quiz_name?: string; // New field for quiz name
  current_question: number;
  answers: { [key: string]: string };
  status: string;
  score?: number;
  total_questions?: number;
  started_at?: string;
  updated_at?: string;
}

interface QuizProgressListProps {
  username: string;
}

const QuizProgressList: React.FC<QuizProgressListProps> = ({ username }) => {
  const [progressList, setProgressList] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgressList = async () => {
      try {
        const response = await fetch(`https://swift-ios-quizzes-backend.onrender.com/users/${username}/quizProgress`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz progress');
        }
        const data: QuizProgress[] = await response.json();
        setProgressList(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProgressList();
  }, [username]);

  if (loading) return <p>Loading your quiz progress...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="quiz-progress-list">
      <h2>Your Quiz Progress</h2>
      {progressList.length === 0 ? (
        <p>You haven't taken any quizzes yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Quiz Name</th> {/* New column */}
              <th>Status</th>
              <th>Score</th>
              <th>Total Questions</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {progressList.map((progress, index) => (
              <tr key={index}>
                <td>{progress.quiz_name || '-'}</td> {/* Display quiz name */}
                <td>{progress.status}</td>
                <td>{progress.score !== undefined ? progress.score : '-'}</td>
                <td>{progress.total_questions !== undefined ? progress.total_questions : '-'}</td>
                <td>{progress.updated_at ? new Date(progress.updated_at).toLocaleString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuizProgressList;
