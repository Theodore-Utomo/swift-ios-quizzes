import React, { useCallback, useEffect, useState } from "react";
import { Users, BookOpen, FileText, BarChart3, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { MetricsOut } from "@/types/metrics";
import { getApiErrorMessage } from "@/lib/utils";

export const MetricsTab: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchMetrics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiService.getMetrics();
      setMetrics(response.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-56">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600">Loading metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load metrics</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchMetrics}>Try again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No metrics available</CardTitle>
          <CardDescription>There is no data to show yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchMetrics}>Refresh</Button>
        </CardContent>
      </Card>
    );
  }

  const quizzesPerCourse =
    metrics.number_of_courses > 0 ? metrics.number_of_quizzes / metrics.number_of_courses : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Metrics Snapshot</h2>
          <p className="text-sm text-muted-foreground">High-level activity across your learning platform.</p>
        </div>
        <Button variant="outline" onClick={fetchMetrics}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total_students}</div>
            <p className="text-xs text-muted-foreground">Students enrolled in the platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.number_of_courses}</div>
            <p className="text-xs text-muted-foreground">Active courses available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.number_of_quizzes}</div>
            <p className="text-xs text-muted-foreground">Quiz assessments created</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Quick Insights
          </CardTitle>
          <CardDescription>Simple derived metrics for a quick health check.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Average quizzes per course:</span>{" "}
            {quizzesPerCourse.toFixed(1)}
          </p>
          <p>
            <span className="font-medium">Student-to-course ratio:</span>{" "}
            {metrics.number_of_courses > 0
              ? (metrics.total_students / metrics.number_of_courses).toFixed(1)
              : "N/A"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
