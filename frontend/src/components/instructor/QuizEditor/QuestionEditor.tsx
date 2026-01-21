import React from "react";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { Question, QuestionType } from "../../../types/quiz";
import { AnswerOptionsEditor } from "./AnswerOptionsEditor";
import { CorrectAnswerInput } from "./CorrectAnswerInput";

interface QuestionEditorProps {
  question: Question;
  onChange: (field: keyof Question, value: unknown) => void;
  onDelete: () => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
  onDelete,
}) => {
  return (
    <Card>
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
                    Are you sure you want to delete this question? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Question Type</Label>
          <Select
            value={question.question_type}
            onValueChange={(value) => onChange("question_type", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={QuestionType.MCQ}>
                Multiple Choice (Single Answer)
              </SelectItem>
              <SelectItem value={QuestionType.MULTIPLE_ANSWER}>
                Multiple Choice (Multiple Answers)
              </SelectItem>
              <SelectItem value={QuestionType.SHORT_ANSWER}>
                Short Answer
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Question Text</Label>
          <MarkdownEditor
            value={question.question_text}
            onChange={(value) => onChange("question_text", value)}
            placeholder="Enter your question... (Supports Markdown for code syntax highlighting)"
            rows={4}
          />
        </div>

        {(question.question_type === QuestionType.MCQ ||
          question.question_type === QuestionType.MULTIPLE_ANSWER) && (
          <AnswerOptionsEditor
            options={question.question_options}
            onOptionsChange={(opts) => onChange("question_options", opts)}
          />
        )}

        <CorrectAnswerInput
          questionType={question.question_type}
          options={question.question_options}
          value={question.question_answer}
          onChange={(v) => onChange("question_answer", v)}
        />

        <div className="space-y-2">
          <Label>Feedback (Optional)</Label>
          <MarkdownEditor
            value={question.question_hint || ""}
            onChange={(value) => onChange("question_hint", value)}
            placeholder="Provide helpful feedback... (Supports Markdown and line breaks)"
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
