import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { apiService, createUserApiService } from '../services/api';
import { QuizProgressSubmission } from '../types';

/**
 * Hook that provides API methods with automatic user context handling
 * For user-specific operations like quiz progress
 */
export const useUserApi = () => {
  const { getUserId, requireAuth } = useAuth();

  const userApiService = useMemo(() => {
    const userId = getUserId();
    if (!userId) {
      return null;
    }
    return createUserApiService(userId);
  }, [getUserId]);

  // Wrapper methods that ensure authentication
  const authenticatedApi = useMemo(() => ({
    // Quiz Progress methods with automatic user context
    getMyQuizProgress: async () => {
      requireAuth();
      if (!userApiService) throw new Error('User not authenticated');
      return userApiService.getUserQuizProgress();
    },

    submitMyQuizProgress: async (quizId: string, data: QuizProgressSubmission) => {
      requireAuth();
      if (!userApiService) throw new Error('User not authenticated');
      return userApiService.submitUserQuizProgress(quizId, data);
    },

    // Regular API methods (no user context needed)
    ...apiService,
  }), [userApiService, requireAuth]);

  return authenticatedApi;
};

export default useUserApi;
