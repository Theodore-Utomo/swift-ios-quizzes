import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { CheckCircleIcon, ClockIcon, PlayIcon, XCircleIcon } from 'lucide-react';
import { QuizProgress, QuizProgressStatus } from "../types/progress";
import { useUserApi } from '../hooks/useUserApi';
import { getApiErrorMessage } from "@/lib/utils";

interface QuizProgressListProps {}

const QuizProgressList: React.FC<QuizProgressListProps> = () => {
  const [progressList, setProgressList] = useState<QuizProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userApi = useUserApi();

  const getStatusBadge = (status: QuizProgressStatus) => {
    switch (status) {
      case QuizProgressStatus.COMPLETED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircleIcon className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case QuizProgressStatus.IN_PROGRESS:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            <ClockIcon className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case QuizProgressStatus.NOT_STARTED:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            <PlayIcon className="w-3 h-3 mr-1" />
            Not Started
          </Badge>
        );
      case QuizProgressStatus.ABANDONED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircleIcon className="w-3 h-3 mr-1" />
            Abandoned
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const formatScore = (score?: number, totalQuestions?: number) => {
    if (score !== undefined && totalQuestions !== undefined) {
      const percentage = Math.round((score / totalQuestions) * 100);
      return `${score}/${totalQuestions} (${percentage}%)`;
    }
    return '-';
  };

  useEffect(() => {
    const fetchProgressList = async () => {
      try {
        const response = await userApi.getMyQuizProgress();
        setProgressList(response.data);
      } catch (err) {
        setError(getApiErrorMessage(err, 'An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProgressList();
  }, [userApi]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Quiz Progress</CardTitle>
          <CardDescription>Loading your quiz progress...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Quiz Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 text-red-600">
            <XCircleIcon className="w-5 h-5" />
            <span>Error: {error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Quiz Progress</CardTitle>
        <CardDescription>
          Track your quiz performance and completion status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {progressList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <PlayIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes taken yet</h3>
            <p className="text-gray-500">Start taking quizzes to see your progress here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quiz Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Last Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {progressList.map((progress, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {progress.quiz_name || '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(progress.status)}
                  </TableCell>
                  <TableCell>
                    {formatScore(progress.score, progress.total_questions)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {progress.updated_at 
                      ? new Date(progress.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : '-'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizProgressList;
