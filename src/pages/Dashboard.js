import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import TutorDashboard from "./TutorDashboard";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  switch (currentUser.role) {
    case "admin":
      return <AdminDashboard />;
    case "tutor":
      return <TutorDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <div>Unknown role</div>;
  }
};

export default Dashboard;
