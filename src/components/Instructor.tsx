import React, { useState } from "react";
import { Question } from "../types";


interface QuizPayload {
  id: number;
  name: string;
  content: Question[];
}

const InstructorPanel: React.FC = () => {
  const [quiz, setQuiz] = useState<QuizPayload>({
    id: 0,
    name: "",
    content: []
  });

  // newOptions holds temporary option text for each question.
  const [newOptions, setNewOptions] = useState<string[]>([]);

  // Adds a new question with default values.
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question_number: quiz.content.length + 1,
      question_type: "MCQ",
      question_text: "",
      question_options: [],
      question_answer: ""
    };
    setQuiz(prevQuiz => ({
      ...prevQuiz,
      content: [...prevQuiz.content, newQuestion]
    }));
    setNewOptions(prev => [...prev, ""]);
  };

  // Updates a question's field.
  const handleQuestionChange = (index: number, field: string, value: any) => {
    const updatedQuestions = [...quiz.content];
    const question = { ...updatedQuestions[index] };

    if (field === "question_text") {
      question.question_text = value;
    } else if (field === "question_type") {
      question.question_type = value;
      // If switching to Short_answer, clear options.
      if (value === "Short_answer") {
        question.question_options = [];
        question.question_answer = "";
      } else {
        // Otherwise, reset answer field.
        question.question_answer = "";
      }
    } else if (field === "question_answer") {
      if (question.question_type === "Multiple_answer") {
        // Split comma-separated values.
        question.question_answer = value.split(",").map((s: string) => s.trim());
      } else {
        question.question_answer = value;
      }
    }

    updatedQuestions[index] = question;
    setQuiz(prevQuiz => ({ ...prevQuiz, content: updatedQuestions }));
  };

  // Adds an option to the question at index qIndex.
  const handleAddOption = (qIndex: number) => {
    const optionValue = newOptions[qIndex].trim();
    if (optionValue === "") return;
    const updatedQuestions = [...quiz.content];
    const question = { ...updatedQuestions[qIndex] };
    question.question_options = [...question.question_options, optionValue];
    updatedQuestions[qIndex] = question;
    setQuiz(prevQuiz => ({ ...prevQuiz, content: updatedQuestions }));
    // Clear the temporary option input for this question.
    const updatedNewOptions = [...newOptions];
    updatedNewOptions[qIndex] = "";
    setNewOptions(updatedNewOptions);
  };

  // Submits the quiz to the backend endpoint.
  const handleSubmitQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(quiz)
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting quiz:", errorData);
      } else {
        const data = await response.json();
        console.log("Quiz submitted successfully:", data);
        alert("Quiz successfully submitted");
        // Optionally, clear the form or display a success message.
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="instructor-panel">
      <h1>Add a New Quiz</h1>
      <form onSubmit={handleSubmitQuiz}>
        <div>
          <label htmlFor="quiz-id">Quiz ID:</label>
          <input
            type="number"
            id="quiz-id"
            value={quiz.id}
            onChange={(e) =>
              setQuiz({ ...quiz, id: parseInt(e.target.value, 10) })
            }
            required
          />
        </div>
        <div>
          <label htmlFor="quiz-name">Quiz Name:</label>
          <input
            type="text"
            id="quiz-name"
            value={quiz.name}
            onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
            required
          />
        </div>
        <hr />
        <h2>Questions</h2>
        {quiz.content.map((question, index) => (
          <div key={index} className="question-form">
            <h3>Question {question.question_number}</h3>
            <div>
              <label>Question Type:</label>
              <select
                value={question.question_type}
                onChange={(e) =>
                  handleQuestionChange(index, "question_type", e.target.value)
                }
              >
                <option value="MCQ">MCQ</option>
                <option value="Multiple_answer">Multiple Answer</option>
                <option value="Short_answer">Short Answer</option>
              </select>
            </div>
            <div>
              <label>Question Text:</label>
              <textarea
                value={question.question_text}
                onChange={(e) =>
                  handleQuestionChange(index, "question_text", e.target.value)
                }
                required
              />
            </div>
            {(question.question_type === "MCQ" ||
              question.question_type === "Multiple_answer") && (
              <div>
                <label>Options:</label>
                <ul>
                  {question.question_options.map((option, idx) => (
                    <li key={idx}>{option}</li>
                  ))}
                </ul>
                <input
                  type="text"
                  value={newOptions[index] || ""}
                  onChange={(e) => {
                    const updatedNewOptions = [...newOptions];
                    updatedNewOptions[index] = e.target.value;
                    setNewOptions(updatedNewOptions);
                  }}
                  placeholder="Add option"
                />
                <button type="button" onClick={() => handleAddOption(index)}>
                  Add Option
                </button>
              </div>
            )}
            <div>
              <label>
                {question.question_type === "Multiple_answer"
                  ? "Answers (comma-separated):"
                  : "Answer:"}
              </label>
              <input
                type="text"
                value={
                  typeof question.question_answer === "string"
                    ? question.question_answer
                    : (question.question_answer as string[]).join(", ")
                }
                onChange={(e) =>
                  handleQuestionChange(index, "question_answer", e.target.value)
                }
                required
              />
            </div>
            <hr />
          </div>
        ))}
        <button type="button" onClick={handleAddQuestion}>
          Add Question
        </button>
        <br />
        <button type="submit">Submit Quiz</button>
      </form>
    </div>
  );
};

export default InstructorPanel;
