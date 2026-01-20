import React from "react";
import { BookOpen, Users, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CourseData } from "./hooks/useInstructorDashboard";

interface OverviewTabProps {
  courses: CourseData[];
  onSelectCourse: (course: CourseData) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  courses,
  onSelectCourse,
}) => (
  <div className="space-y-4">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{courses.length}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {courses.reduce((sum, course) => sum + (course.quiz_count || 0), 0)}
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Courses</CardTitle>
          <CardDescription>Your most recently created courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {courses.slice(0, 5).map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{course.name}</span>
                  <Badge variant="secondary">{course.quiz_count || 0} quizzes</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectCourse(course)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);
