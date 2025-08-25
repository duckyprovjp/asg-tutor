# Tutor Navigation Implementation

## Problem

The "Xem chi tiết" (View Details) buttons in the tutor cards were not functional - they didn't navigate to the tutor's detailed profile page.

## Solution

Implemented navigation functionality to route users to `/tutors/${id}` when clicking the "Xem chi tiết" button, displaying detailed tutor information.

## Changes Made

### 1. **StudentDashboard.js**

- Added `useNavigate` hook from react-router-dom
- Created `handleViewTutorDetails(tutorId)` function
- Updated "Xem chi tiết" button with `onClick` handler
- Fixed tutor name display to use `tutor.fullName` instead of `tutor.bio`

### 2. **TutorList.js**

- Added `useNavigate` hook from react-router-dom
- Created `handleViewTutorDetails(tutorId)` function
- Updated "Xem chi tiết" button with `onClick` handler
- Fixed tutor name display to use `tutor.fullName` instead of `tutor.bio`

### 3. **TutorProfile.js**

- Fixed API call to use `userAPI.getById(id)` instead of `tutorAPI.getById(id)`
- Added back navigation button with "Quay lại" (Go Back) functionality
- Added page title "Thông tin Giáo viên"
- Improved tutor name display using `tutor.fullName`
- Added fallback text for missing bio descriptions

## How It Works

### Navigation Flow

1. User clicks "Xem chi tiết" button on tutor card
2. `handleViewTutorDetails(tutorId)` function is called
3. User is navigated to `/tutors/${tutorId}`
4. TutorProfile component loads and displays tutor details

### Data Flow

1. TutorProfile component uses `useParams()` to get tutor ID from URL
2. Calls `userAPI.getById(id)` to fetch tutor data from users table
3. Calls `reviewAPI.getByTutor(id)` to fetch tutor reviews
4. Displays comprehensive tutor information

## Features

### Tutor Profile Page Includes:

- **Tutor Information**: Name, avatar, rating, hourly rate
- **Contact Actions**: "Đăng ký học" (Register for class), "Nhắn tin" (Send message)
- **Detailed Information**: Subjects, location, experience, education
- **Bio/Description**: Tutor's self-description
- **Reviews**: Student reviews with ratings and comments
- **Navigation**: Back button to return to previous page

### Navigation Features:

- **Seamless Navigation**: Click button → navigate to detailed view
- **Back Navigation**: Easy return to previous page
- **URL-based Routing**: Direct access to tutor profiles via URL
- **Responsive Design**: Works on all screen sizes

## Testing

To test the implementation:

1. **Start the application**:

   ```bash
   cd asg
   npm start
   ```

2. **Login as a student** and navigate to the dashboard

3. **Click "Xem chi tiết"** on any tutor card

4. **Verify navigation** to tutor profile page

5. **Test back navigation** using the "Quay lại" button

6. **Test direct URL access** by going to `/tutors/2` (for tutor ID 2)

## Current Tutor IDs in Database

- "2" - tutor1 (Nguyễn Văn A) - Mathematics, Physics
- Additional tutors can be added through registration

## Benefits

- **Better User Experience**: Users can now view detailed tutor information
- **Improved Navigation**: Seamless flow between tutor lists and profiles
- **Data Consistency**: Proper display of tutor names and information
- **Accessibility**: Direct URL access to tutor profiles
- **Responsive Design**: Works on all devices

## Files Modified

- `src/pages/StudentDashboard.js` - Added navigation functionality
- `src/pages/TutorList.js` - Added navigation functionality
- `src/pages/TutorProfile.js` - Fixed API calls and improved UI
