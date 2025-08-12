import { useUser } from '../contexts/UserContext';

export const useAuth = () => {
  try {
    const { user, isAuthenticated, loading, login, logout, updateUser } = useUser();

    // Return the context data
    return {
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser,
      getUserId: () => user?.id || null,
      getUserEmail: () => user?.email || null,
      getUserRole: () => user?.role || null,
      getSessionToken: () => user?.sessionToken || null,
      isInstructor: () => user?.role === 'instructor',
      isStudent: () => user?.role === 'student',
      requireAuth: () => {
        if (!isAuthenticated) {
          throw new Error('User must be authenticated');
        }
        return user!;
      },
    };
  } catch (error) {
    console.error('useAuth error:', error);
    // Return safe defaults if context is not available
    return {
      user: null,
      isAuthenticated: false,
      loading: true,
      login: async () => {},
      logout: () => {},
      updateUser: () => {},
      getUserId: () => null,
      getUserEmail: () => null,
      getUserRole: () => null,
      getSessionToken: () => null,
      isInstructor: () => false,
      isStudent: () => false,
      requireAuth: () => {
        throw new Error('User must be authenticated');
      },
    };
  }
};

export default useAuth;
