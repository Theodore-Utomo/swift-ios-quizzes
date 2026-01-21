import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizEditor from "./QuizEditor";
import { Quiz } from "../../types/quiz";

interface EditQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  quiz: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const EditQuizDialog: React.FC<EditQuizDialogProps> = ({
  open,
  onOpenChange,
  courseName,
  quiz,
  onSave,
  onCancel,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Quiz</DialogTitle>
        <DialogDescription>
          Edit &quot;{quiz.name}&quot; for {courseName}.
        </DialogDescription>
      </DialogHeader>
      <QuizEditor quiz={quiz} onSave={onSave} onCancel={onCancel} isNew={false} />
    </DialogContent>
  </Dialog>
);
