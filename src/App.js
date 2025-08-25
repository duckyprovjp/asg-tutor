import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TutorDashboard from "./pages/TutorDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TutorList from "./pages/TutorList";
import TutorProfile from "./pages/TutorProfile";
import ScheduleManagement from "./pages/ScheduleManagement";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";

// Components
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AppContent = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {currentUser && <Navbar />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Public routes */}
          <Route
            path="/login"
            element={!currentUser ? <Login /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/register"
            element={!currentUser ? <Register /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/forgot-password"
            element={
              !currentUser ? <ForgotPassword /> : <Navigate to="/dashboard" />
            }
          />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                {currentUser?.role === "admin" ? (
                  <AdminDashboard />
                ) : currentUser?.role === "tutor" ? (
                  <TutorDashboard />
                ) : (
                  <StudentDashboard />
                )}
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route path="/tutors" element={<TutorList />} />
          <Route path="/tutors/:id" element={<TutorProfile />} />

          <Route
            path="/schedule"
            element={
              <PrivateRoute>
                <ScheduleManagement />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <PrivateRoute>
                <Messages />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route
            path="/"
            element={<Navigate to={currentUser ? "/dashboard" : "/login"} />}
          />
          <Route
            path="*"
            element={<Navigate to={currentUser ? "/dashboard" : "/login"} />}
          />
        </Routes>
      </Box>
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
