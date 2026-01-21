import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import type { CourseData } from "./hooks/useInstructorDashboard";

interface CourseCardProps {
  course: CourseData;
  onManageQuizzes: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onManageQuizzes,
  onEdit,
  onDelete,
}) => (
  <Card className="hover:shadow-md transition-shadow h-full">
    <CardHeader className="flex-1">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">{course.name}</CardTitle>
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
                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &quot;{course.name}&quot;? This
                  action cannot be undone and will delete all associated quizzes.
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
        <Badge variant="secondary">{course.quiz_count || 0} quizzes</Badge>
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button className="w-full" variant="outline" onClick={onManageQuizzes}>
        Manage Quizzes
      </Button>
    </CardContent>
  </Card>
);
