# User ID Management Guide

## Problem

Previously, some components were using hardcoded user IDs (like `const studentId = 1;`) instead of getting the ID from the currently logged-in user. This caused issues when different users logged in, as they would see data for user ID 1 instead of their own data.

## Solution

All components now properly get user IDs from the authentication context using the `useAuth` hook and the new `useUserInfo` utility.

## How to Get User IDs Properly

### 1. Using the useAuth Hook (Basic Approach)

```javascript
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { currentUser } = useAuth();

  // Get user ID
  const userId = currentUser?.id;

  // Use the ID for API calls
  const loadData = async () => {
    const response = await api.getByUser(userId);
    // ...
  };
};
```

### 2. Using the useUserInfo Hook (Recommended)

```javascript
import { useUserInfo } from "../utils/userUtils";

const MyComponent = () => {
  const { userId, role, isStudent, isTutor, isAdmin } = useUserInfo();

  // Get user ID with role checking
  const loadData = async () => {
    if (isStudent) {
      const response = await scheduleAPI.getByStudent(userId);
    } else if (isTutor) {
      const response = await scheduleAPI.getByTutor(userId);
    }
  };
};
```

### 3. Utility Functions

```javascript
import {
  getUserApiId,
  getRoleDisplayName,
  hasPermission,
} from "../utils/userUtils";

const MyComponent = () => {
  const { currentUser } = useAuth();

  // Get appropriate ID for API calls
  const apiId = getUserApiId(currentUser);

  // Get role display name
  const roleName = getRoleDisplayName(currentUser.role);

  // Check permissions
  const canEdit = hasPermission(currentUser, "edit_schedules");
};
```

## Examples by Role

### For Students

```javascript
const StudentDashboard = () => {
  const { userId } = useUserInfo();

  const loadStudentData = async () => {
    const [schedules, reviews] = await Promise.all([
      scheduleAPI.getByStudent(userId),
      reviewAPI.getByStudent(userId),
    ]);
  };
};
```

### For Tutors

```javascript
const TutorDashboard = () => {
  const { userId } = useUserInfo();

  const loadTutorData = async () => {
    const [schedules, attendance, reviews] = await Promise.all([
      scheduleAPI.getByTutor(userId),
      attendanceAPI.getByTutor(userId),
      reviewAPI.getByTutor(userId),
    ]);
  };
};
```

### For Admins

```javascript
const AdminDashboard = () => {
  const { userId } = useUserInfo();

  const loadAdminData = async () => {
    // Admins can access all data
    const [users, schedules, tutors] = await Promise.all([
      userAPI.getAll(),
      scheduleAPI.getAll(),
      tutorAPI.getAll(),
    ]);
  };
};
```

## Best Practices

### ✅ Do This

```javascript
// Get ID from current user
const userId = currentUser?.id;

// Use utility hook
const { userId } = useUserInfo();

// Check role before making API calls
if (isStudent) {
  const data = await scheduleAPI.getByStudent(userId);
}
```

### ❌ Don't Do This

```javascript
// Hardcoded IDs
const studentId = 1;
const tutorId = 2;

// Assuming user role
const data = await scheduleAPI.getByStudent(1);
```

## Security Benefits

1. **Data Isolation**: Each user only sees their own data
2. **Prevents Data Leakage**: No accidental access to other users' information
3. **Role-Based Access**: Proper permission checking based on user role
4. **Dynamic Content**: Content changes based on logged-in user

## Files Updated

- `src/pages/StudentDashboard.js` - Now uses `userId` from `useUserInfo()`
- `src/pages/TutorDashboard.js` - Now uses `userId` from `useUserInfo()`
- `src/pages/ScheduleManagement.js` - Now uses proper API service functions
- `src/utils/userUtils.js` - New utility functions for user management

## Testing

To verify the fix works:

1. **Login as different users** and check that each sees their own data
2. **Register new users** and verify they get sequential IDs
3. **Check role-based access** - students see student data, tutors see tutor data
4. **Verify no data leakage** - users can't see other users' information

## Current User IDs in Database

- "1" - admin (admin@tutoring.com)
- "2" - tutor1 (tutor1@example.com)
- "3" - student1 (student1@example.com)
- "4" - ducky (hiennn30@gmail.com) - student

Each user now properly accesses their own data based on their ID from the authentication context.
