import { useUser } from '../contexts/UserContext';

export const useAuth = () => {
  const { user, isAuthenticated, loading, login, logout, updateUser } = useUser();

  // Convenience methods
  const getUserId = () => user?.id || null;
  const getUserEmail = () => user?.email || null;
  const getUserRole = () => user?.role || null;
  const getSessionToken = () => user?.sessionToken || null;
  const isInstructor = () => user?.role === 'instructor';
  const isStudent = () => user?.role === 'student';

  // Require authentication wrapper
  const requireAuth = () => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated');
    }
    return user!;
  };

  return {
    // User data
    user,
    isAuthenticated,
    loading,
    
    // Actions
    login,
    logout,
    updateUser,
    
    // Convenience getters
    getUserId,
    getUserEmail,
    getUserRole,
    getSessionToken,
    isInstructor,
    isStudent,
    
    // Utilities
    requireAuth,
  };
};

export default useAuth;
