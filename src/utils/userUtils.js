import { useAuth } from "../context/AuthContext";

/**
 * Hook to get the current user's ID based on their role
 * @returns {object} Object containing user ID and role information
 */
export const useUserInfo = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return {
      userId: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
      isTutor: false,
      isStudent: false,
    };
  }

  return {
    userId: currentUser.id,
    role: currentUser.role,
    isAuthenticated: true,
    isAdmin: currentUser.role === "admin",
    isTutor: currentUser.role === "tutor",
    isStudent: currentUser.role === "student",
  };
};

/**
 * Get the appropriate ID for API calls based on user role
 * @param {object} currentUser - The current user object from auth context
 * @returns {string|null} The appropriate ID to use for API calls
 */
export const getUserApiId = (currentUser) => {
  if (!currentUser) return null;

  // For most cases, we use the user's ID directly
  // This works for students, tutors, and admins
  return currentUser.id;
};

/**
 * Get display name for user role
 * @param {string} role - User role
 * @returns {string} Display name for the role
 */
export const getRoleDisplayName = (role) => {
  switch (role) {
    case "admin":
      return "Quản trị viên";
    case "tutor":
      return "Giáo viên";
    case "student":
      return "Học sinh";
    default:
      return "Người dùng";
  }
};

/**
 * Check if user has permission for specific action
 * @param {object} currentUser - Current user object
 * @param {string} action - Action to check permission for
 * @returns {boolean} Whether user has permission
 */
export const hasPermission = (currentUser, action) => {
  if (!currentUser) return false;

  const permissions = {
    admin: ["all"],
    tutor: [
      "view_schedules",
      "manage_attendance",
      "view_reviews",
      "manage_profile",
    ],
    student: [
      "view_schedules",
      "book_sessions",
      "write_reviews",
      "manage_profile",
    ],
  };

  const userPermissions = permissions[currentUser.role] || [];
  return userPermissions.includes("all") || userPermissions.includes(action);
};
