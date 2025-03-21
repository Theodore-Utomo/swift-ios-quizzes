import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./../styles/ClassDetails.css";

interface Quiz {
  id: string;
  name: string;
  content: any[];
}

interface ClassOut {
  class_id: string;
  name: string;
}

const ClassDetails: React.FC = () => {
  const { classId } = useParams<{ classId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [classInfo, setClassInfo] = useState<ClassOut | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch class details to display the class name.
        const classRes = await fetch(`http://127.0.0.1:8000/classes/${classId}`);
        if (!classRes.ok) {
          throw new Error("Failed to fetch class info");
        }
        const classData = await classRes.json();
        setClassInfo(classData);

        // Fetch quizzes for the class.
        const quizzesRes = await fetch(`http://127.0.0.1:8000/classes/${classId}/quizzes/`);
        if (!quizzesRes.ok) {
          throw new Error("Failed to fetch quizzes");
        }
        const quizzesData = await quizzesRes.json();
        setQuizzes(quizzesData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [classId]);

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="class-details-container">
      <h1>Quizzes for Class: {classInfo ? classInfo.name : classId}</h1>
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      {quizzes.length === 0 ? (
        <p>No quizzes found for this class.</p>
      ) : (
        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <button
                className="quiz-button"
                onClick={() => navigate(`/classes/${classId}/quizzes/${quiz.id}`)}
              >
                {quiz.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassDetails;
