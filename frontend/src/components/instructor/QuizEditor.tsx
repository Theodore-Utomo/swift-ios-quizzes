import React, { useState } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Quiz, Question, QuestionType } from "../../types/quiz";

interface QuizEditorProps {
  quiz: Quiz;
  onSave: (updatedQuiz: Quiz) => void;
  onCancel: () => void;
  isNew: boolean;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz, onSave, onCancel, isNew }) => {
  const [editedQuiz, setEditedQuiz] = useState<Quiz>(quiz);
  const [newOptions, setNewOptions] = useState<{ [index: number]: string }>({});

  const handleQuizNameChange = (name: string) => {
    setEditedQuiz({ ...editedQuiz, name });
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any
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
      question_hint: ""
    };
    setEditedQuiz({
      ...editedQuiz,
      content: [...editedQuiz.content, newQuestion]
    });
  };

  const handleDeleteQuestion = (index: number) => {
    const updatedQuestions = editedQuiz.content.filter((_, i) => i !== index);
    // Re-number questions
    updatedQuestions.forEach((q, i) => (q.question_number = i + 1));
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
  };

  const handleAddOption = (questionIndex: number) => {
    const optionValue = newOptions[questionIndex]?.trim();
    if (!optionValue) return;

    const updatedQuestions = [...editedQuiz.content];
    const question = updatedQuestions[questionIndex];
    question.question_options = [...question.question_options, optionValue];
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });

    // Clear the new option for this question
    setNewOptions((prev) => ({ ...prev, [questionIndex]: "" }));
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...editedQuiz.content];
    const question = updatedQuestions[questionIndex];
    question.question_options = question.question_options.filter((_, i) => i !== optionIndex);
    setEditedQuiz({ ...editedQuiz, content: updatedQuestions });
  };

  const handleSave = () => {
    if (!editedQuiz.name.trim()) {
      alert("Please enter a quiz name");
      return;
    }

    if (editedQuiz.content.length === 0) {
      alert("Please add at least one question");
      return;
    }

    // Validate questions
    for (const question of editedQuiz.content) {
      if (!question.question_text.trim()) {
        alert("Please fill in all question texts");
        return;
      }

      if ((question.question_type === QuestionType.MCQ || question.question_type === QuestionType.MULTIPLE_ANSWER) && question.question_options.length < 2) {
        alert("Multiple choice questions must have at least 2 options");
        return;
      }

      if (!question.question_answer || 
          (typeof question.question_answer === "string" && !question.question_answer.trim()) ||
          (Array.isArray(question.question_answer) && question.question_answer.length === 0)) {
        alert("Please provide answers for all questions");
        return;
      }

      if (question.question_type === QuestionType.MCQ || question.question_type === QuestionType.MULTIPLE_ANSWER) {
        const answerArray = typeof question.question_answer === "string" 
          ? question.question_answer.split(", ").filter(a => a.trim())
          : question.question_answer;
        
        const invalidAnswers = answerArray.filter(answer => !question.question_options.includes(answer));
        if (invalidAnswers.length > 0) {
          alert(`Invalid answer(s) for question ${question.question_number}: ${invalidAnswers.join(", ")}. Please select from available options.`);
          return;
        }
      }
    }

    onSave(editedQuiz);
  };

  return (
    <div className="space-y-6 p-1">
      {/* Quiz Name */}
      <div className="space-y-2">
        <Label htmlFor="quizName" className="text-base font-semibold">Quiz Name</Label>
        <Input
          id="quizName"
          value={editedQuiz.name}
          onChange={(e) => handleQuizNameChange(e.target.value)}
          placeholder="Enter quiz name..."
          className="text-lg"
        />
      </div>

      {/* Questions */}
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
              <Card key={index}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Question {question.question_number}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {question.question_type.replace("_", " ")}
                      </Badge>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Question</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this question? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteQuestion(index)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Question Type */}
                  <div className="space-y-2">
                    <Label>Question Type</Label>
                    <Select
                      value={question.question_type}
                      onValueChange={(value) =>
                        handleQuestionChange(index, "question_type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={QuestionType.MCQ}>Multiple Choice (Single Answer)</SelectItem>
                        <SelectItem value={QuestionType.MULTIPLE_ANSWER}>Multiple Choice (Multiple Answers)</SelectItem>
                        <SelectItem value={QuestionType.SHORT_ANSWER}>Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Question Text */}
                  <div className="space-y-2">
                    <Label>Question Text</Label>
                    <MarkdownEditor
                      value={question.question_text}
                      onChange={(value) =>
                        handleQuestionChange(index, "question_text", value)
                      }
                      placeholder="Enter your question... (Supports Markdown for code syntax highlighting)"
                      rows={4}
                    />
                  </div>

                  {/* Options for MCQ and Multiple Answer */}
                  {(question.question_type === QuestionType.MCQ || question.question_type === QuestionType.MULTIPLE_ANSWER) && (
                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      <div className="space-y-2">
                        {question.question_options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <Input value={option} readOnly className="flex-1" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveOption(index, optionIndex)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center space-x-2">
                          <Input
                            value={newOptions[index] || ""}
                            onChange={(e) =>
                              setNewOptions((prev) => ({ ...prev, [index]: e.target.value }))
                            }
                            placeholder="Add new option..."
                            className="flex-1"
                          />
                          <Button
                            onClick={() => handleAddOption(index)}
                            disabled={!newOptions[index]?.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Correct Answer */}
                  <div className="space-y-2">
                    <Label>
                      {question.question_type === QuestionType.MULTIPLE_ANSWER
                        ? "Correct Answers"
                        : "Correct Answer"}
                    </Label>
                    {question.question_type === QuestionType.MCQ ? (
                      <Select
                        value={typeof question.question_answer === "string" ? question.question_answer : ""}
                        onValueChange={(value) =>
                          handleQuestionChange(index, "question_answer", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select the correct answer" />
                        </SelectTrigger>
                        <SelectContent>
                          {question.question_options.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : question.question_type === QuestionType.MULTIPLE_ANSWER ? (
                      <div className="space-y-2">
                        {question.question_options.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Add answer options first</p>
                        ) : (
                          question.question_options.map((option) => {
                            const currentAnswers = Array.isArray(question.question_answer) 
                              ? question.question_answer 
                              : typeof question.question_answer === "string" 
                                ? question.question_answer.split(", ").filter(a => a.trim()) 
                                : [];
                            const isChecked = currentAnswers.includes(option);
                            
                            return (
                              <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${index}-${option}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    let newAnswers;
                                    if (checked) {
                                      newAnswers = [...currentAnswers, option];
                                    } else {
                                      newAnswers = currentAnswers.filter(a => a !== option);
                                    }
                                    handleQuestionChange(index, "question_answer", newAnswers.join(", "));
                                  }}
                                />
                                <Label 
                                  htmlFor={`${index}-${option}`}
                                  className="text-sm font-normal cursor-pointer"
                                >
                                  {option}
                                </Label>
                              </div>
                            );
                          })
                        )}
                      </div>
                    ) : (
                      <Input
                        value={
                          typeof question.question_answer === "string"
                            ? question.question_answer
                            : (question.question_answer as string[]).join(", ")
                        }
                        onChange={(e) =>
                          handleQuestionChange(index, "question_answer", e.target.value)
                        }
                        placeholder="Expected answer"
                      />
                    )}
                  </div>

                  {/* Hint */}
                  <div className="space-y-2">
                    <Label>Hint (Optional)</Label>
                    <Input
                      value={question.question_hint}
                      onChange={(e) =>
                        handleQuestionChange(index, "question_hint", e.target.value)
                      }
                      placeholder="Provide a helpful hint..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Questions ({editedQuiz.content.length})</h3>
          <Button onClick={handleAddQuestion} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
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