import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../services/api";
import { getApiErrorMessage } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Quiz } from "../types/quiz";
import { CourseOut } from "../types/course";

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courseInfo, setCourseInfo] = useState<CourseOut | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const sortedQuizzes = useMemo(() => {
    const cleaned = quizzes.map(q => ({...q, name: q.name.trim()}))
    const sorted = [...cleaned].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); 
    return sorted;

  }, [quizzes]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await apiService.getCourse(courseId!);
        setCourseInfo(courseRes.data);

        const quizzesRes = await apiService.getCourseQuizzes(courseId!);
        setQuizzes(quizzesRes.data);
      } catch (err: unknown) {
        setError(getApiErrorMessage(err, "Something went wrong"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {courseInfo ? courseInfo.name : "Course"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Quizzes for this course
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-4 w-1/3 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full rounded bg-muted" />
                <div className="mt-2 h-4 w-5/6 rounded bg-muted" />
              </CardContent>
              <CardFooter>
                <div className="h-9 w-24 rounded bg-muted" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive">Failed to load</CardTitle>
            <CardDescription>We couldn't load this course or its quizzes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" onClick={() => navigate(0)}>Retry</Button>
          </CardFooter>
        </Card>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No quizzes yet</CardTitle>
            <CardDescription>
              This course doesn't have any quizzes yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedQuizzes.map((quiz) => (
            <Card key={quiz.id} className="group">
              <CardHeader>
                <CardTitle>{quiz.name}</CardTitle>
                <CardDescription>Start or continue this quiz</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Contains {quiz.content?.length ?? 0} question(s).
                </p>
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  size="sm"
                  onClick={() => navigate(`/courses/${courseId}/quizzes/${quiz.id}`)}
                >
                  Open quiz
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
