import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const users = response.data;

      if (users && users.length > 0) {
        const user = users[0]; // Take the first matching user
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        return { success: true, user };
      } else {
        return { success: false, message: "Email hoặc mật khẩu không đúng" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Đăng nhập thất bại" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const newUser = response.data;
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return { success: true, user: newUser };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, message: "Đăng ký thất bại" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      return { success: true, message: "Email đặt lại mật khẩu đã được gửi" };
    } catch (error) {
      console.error("Forgot password error:", error);
      return { success: false, message: "Gửi email thất bại" };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authAPI.resetPassword(token, newPassword);
      return { success: true, message: "Đặt lại mật khẩu thành công" };
    } catch (error) {
      console.error("Reset password error:", error);
      return { success: false, message: "Đặt lại mật khẩu thất bại" };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await userAPI.update(currentUser.id, userData);
      const updatedUser = response.data;
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error("Update profile error:", error);
      return { success: false, message: "Cập nhật thông tin thất bại" };
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
