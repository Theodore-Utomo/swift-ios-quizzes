import React, { useState, useEffect } from "react";
import { Plus, Save, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Quiz, Question, QuestionType } from "../../../types/quiz";
import { QuestionEditor } from "./QuestionEditor";
import { validateQuiz } from "./validateQuiz";

interface QuizEditorProps {
  quiz: Quiz;
  onSave: (updatedQuiz: Quiz) => void;
  onCancel: () => void;
  isNew: boolean;
}

const QuizEditor: React.FC<QuizEditorProps> = ({
  quiz,
  onSave,
  onCancel,
  isNew,
}) => {
  const [editedQuiz, setEditedQuiz] = useState<Quiz>(quiz);

  useEffect(() => {
    setEditedQuiz(quiz);
  }, [quiz]);

  const handleQuizNameChange = (name: string) => {
    setEditedQuiz({ ...editedQuiz, name });
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: unknown
  ) => {
    const updatedQuestions = [...editedQuiz.content];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      question_number: editedQuiz.content.length + 1,
      question_type: QuestionType.MCQ,
      question_text: "",
      question_options: [],
      question_answer: "",
      question_hint: "",
    };
    setEditedQuiz({
      ...editedQuiz,
      content: [...editedQuiz.content, newQuestion],
    });
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = editedQuiz.content.filter((_, i) => i !== index);
    updatedQuestions.forEach((q, i) => (q.question_number = i + 1));
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
  };

  const handleSave = () => {
    const err = validateQuiz(editedQuiz);
    if (err) {
      alert(err);
      return;
    }
    onSave(editedQuiz);
  };

  return (
    <div className="space-y-6 p-1">
      <div className="space-y-2">
        <Label htmlFor="quizName" className="text-base font-semibold">
          Quiz Name
        </Label>
        <Input
          id="quizName"
          value={editedQuiz.name}
          onChange={(e) => handleQuizNameChange(e.target.value)}
          placeholder="Enter quiz name..."
          className="text-lg"
        />
      </div>

      <div className="space-y-4">
        {editedQuiz.content.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground mb-4">No questions yet</p>
              <Button onClick={handleAddQuestion}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Question
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {editedQuiz.content.map((question, index) => (
              <QuestionEditor
                key={index}
                question={question}
                onChange={(field, value) =>
                  handleQuestionChange(index, field, value)
                }
                onDelete={() => handleDeleteQuestion(index)}
              />
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Questions ({editedQuiz.content.length})
          </h3>
          <Button onClick={handleAddQuestion} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {isNew ? "Create Quiz" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default QuizEditor;
