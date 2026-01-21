import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { Quiz } from "../../types/quiz";

interface QuizCardProps {
  quiz: Quiz;
  onEdit: () => void;
  onDelete: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  onEdit,
  onDelete,
}) => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{quiz.name}</CardTitle>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{quiz.name}&quot;? This
                  action cannot be undone.
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
      <CardDescription>
        <Badge variant="secondary">{quiz.content.length} questions</Badge>
      </CardDescription>
    </CardHeader>
  </Card>
);
