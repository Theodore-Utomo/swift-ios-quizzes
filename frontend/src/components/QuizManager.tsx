import React, { useEffect, useState } from "react";
import { Quiz } from "../types";
import QuizEditor from "./QuizEditor";
export const API_URL = import.meta.env.VITE_API_URL;


interface QuizManagerProps {
  classId: string;
}

const QuizManager: React.FC<QuizManagerProps> = ({ classId }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newQuizName, setNewQuizName] = useState<string>("");
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [editingQuestions, setEditingQuestions] = useState<boolean>(false);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${API_URL}classes/${classId}/quizzes/`);
      if (!res.ok) throw new Error("Failed to fetch quizzes");
      const data = await res.json();
      setQuizzes(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, [classId]);

  // Save quiz: if the quiz is new (id is empty) use POST, else use PUT.
  const handleSaveQuiz = async (quiz: Quiz) => {
    try {
      if (!quiz.id) {
        // New quiz; POST it.
        const res = await fetch(`http://127.0.0.1:8000/classes/${classId}/quizzes/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quiz),
        });
        if (!res.ok) throw new Error("Failed to add quiz");
      } else {
        // Existing quiz; update it.
        const res = await fetch(`http://127.0.0.1:8000/classes/${classId}/quizzes/${quiz.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quiz),
        });
        if (!res.ok) throw new Error("Failed to update quiz");
      }
      await fetchQuizzes();
      setEditingQuiz(null);
      setEditingQuestions(false);
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/classes/${classId}/quizzes/${quizId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete quiz");
      await fetchQuizzes();
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    }
  };

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div>
      <h3>Quizzes</h3>
      
      {/* Render QuizEditor for new quiz if editingQuiz exists and is new */}
      {editingQuiz && editingQuestions && !editingQuiz.id && (
        <QuizEditor
          quiz={editingQuiz}
          onSave={handleSaveQuiz}
          onCancel={() => {
            setEditingQuiz(null);
            setEditingQuestions(false);
          }}
        />
      )}

      {quizzes.length === 0 ? (
        <p>No quizzes available.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              {editingQuiz && editingQuiz.id === quiz.id && editingQuestions ? (
                <QuizEditor
                  quiz={editingQuiz}
                  onSave={handleSaveQuiz}
                  onCancel={() => {
                    setEditingQuiz(null);
                    setEditingQuestions(false);
                  }}
                />
              ) : (
                <>
                  <span>{quiz.name}</span>
                  <button onClick={() => setEditingQuiz(quiz)}>Edit Name</button>
                  <button
                    onClick={() => {
                      setEditingQuiz(quiz);
                      setEditingQuestions(true);
                    }}
                  >
                    Edit Questions
                  </button>
                  <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <div>
        <h4>Add New Quiz with Questions</h4>
        <input
          type="text"
          placeholder="Quiz Name"
          value={newQuizName}
          onChange={(e) => setNewQuizName(e.target.value)}
        />
        <button
          onClick={() => {
            if (!newQuizName) return;
            // Create a new quiz object with an empty id and empty content.
            const newQuiz: Quiz = {
              id: "", // Empty means new quiz
              name: newQuizName,
              content: []
            };
            setEditingQuiz(newQuiz);
            setEditingQuestions(true);
            setNewQuizName("");
          }}
        >
          Add Quiz with Questions
        </button>
      </div>
    </div>
  );
};

export default QuizManager;
