import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./../styles/QuizList.css";

interface Quiz {
  id: number;
  name: string;
}

interface QuizListProps {
  quizzes: Quiz[];
}

const QuizList: React.FC<QuizListProps> = ({ quizzes }) => {
  const navigate = useNavigate();

  return (
    <div className="quiz-list-container">
      <h1 className="quiz-list-title">Quizzes</h1>
      <ul className="quiz-list">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="quiz-item">
            <button className="quiz-button" onClick={() => navigate(`/quizzes/${quiz.id}`)}>
              {quiz.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizList;