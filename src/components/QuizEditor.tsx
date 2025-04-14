import React, { useState } from "react";
import { Quiz, Question } from "../types";

interface QuizEditorProps {
  quiz: Quiz;
  onSave: (updatedQuiz: Quiz) => void;
  onCancel: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onSave, onCancel }) => {
  const [editedQuiz, setEditedQuiz] = useState<Quiz>(quiz);
  // Using an object to hold new options per question index.
  const [newOptions, setNewOptions] = useState<{ [index: number]: string }>({});

  // Update a field of a question at a given index.
  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const updatedQuestions = [...editedQuiz.content];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
  };

  // Add a new question with default values.
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question_number: editedQuiz.content.length + 1,
      question_type: "MCQ",
      question_text: "",
      question_options: [],
      question_answer: "",
      question_hint: ""
    };
    setEditedQuiz({
      ...editedQuiz,
      content: [...editedQuiz.content, newQuestion]
    });
  };

  // Delete a question.
  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = editedQuiz.content.filter((_, i) => i !== index);
    // Re-number questions:
    updatedQuestions.forEach((q, i) => (q.question_number = i + 1));
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
  };

  // Add an option to a given question.
  const handleAddOption = (index: number) => {
    const optionValue = newOptions[index]?.trim();
    if (!optionValue) return;
    const updatedQuestions = [...editedQuiz.content];
    const question = updatedQuestions[index];
    question.question_options = [...question.question_options, optionValue];
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
    // Clear the new option for this question.
    setNewOptions((prev) => ({ ...prev, [index]: "" }));
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
      <h4>Edit Questions for Quiz: {editedQuiz.name}</h4>
      {editedQuiz.content.map((question, index) => (
        <div
          key={index}
          style={{ border: "1px solid gray", padding: "8px", marginBottom: "10px" }}
        >
          <div>
            <label>Question {question.question_number} Text:</label>
            <input
              type="text"
              value={question.question_text}
              onChange={(e) =>
                handleQuestionChange(index, "question_text", e.target.value)
              }
            />
          </div>
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
            <label>Question Hint:</label>
            <input
              type="text"
              value={question.question_hint}
              onChange={(e) =>
                handleQuestionChange(index, "question_hint", e.target.value)
              }
              placeholder="Enter a hint (optional)"
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
                placeholder="New option"
                value={newOptions[index] || ""}
                onChange={(e) =>
                  setNewOptions((prev) => ({ ...prev, [index]: e.target.value }))
                }
              />
              <button onClick={() => handleAddOption(index)}>Add Option</button>
            </div>
          )}
          <div>
            <label>
              {question.question_type === "Multiple_answer" ||
              question.question_type === "Short_answer"
                ? "Correct Answers (comma separated):"
                : "Correct Answer:"}
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
            />
          </div>
          <button onClick={() => handleDeleteQuestion(index)}>
            Delete Question
          </button>
        </div>
      ))}
      <button onClick={handleAddQuestion}>Add Question</button>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => onSave(editedQuiz)}>Save Questions</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default QuizEditor;
