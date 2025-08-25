import axios from "axios";
import { generateNextId } from "../utils/idGenerator";

const API_BASE_URL = "http://localhost:3001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication APIs
export const authAPI = {
  login: (credentials) =>
    api.get(
      `/users?email=${credentials.email}&password=${credentials.password}`
    ),
  register: async (userData) => {
    try {
      const nextId = await generateNextId("users");
      const userWithId = {
        ...userData,
        id: nextId,
      };
      return await api.post("/users", userWithId);
    } catch (error) {
      throw error;
    }
  },
  forgotPassword: (email) => api.post("/users", { email }),
  resetPassword: (token, newPassword) =>
    api.put(`/users/${token}`, { password: newPassword }),
};

// User APIs
export const userAPI = {
  getAll: () => api.get("/users"),
  getById: (id) => api.get(`/users/${id}`),
  create: async (userData) => {
    try {
      const nextId = await generateNextId("users");
      const userWithId = {
        ...userData,
        id: nextId,
      };
      return await api.post("/users", userWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getByRole: (role) => api.get(`/users?role=${role}`),
};

// Tutor APIs
export const tutorAPI = {
  getAll: () => api.get("/tutors"),
  getById: (id) => api.get(`/tutors/${id}`),
  create: async (tutorData) => {
    try {
      const nextId = await generateNextId("tutors");
      const tutorWithId = {
        ...tutorData,
        id: nextId,
      };
      return await api.post("/tutors", tutorWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, tutorData) => api.put(`/tutors/${id}`, tutorData),
  delete: (id) => api.delete(`/tutors/${id}`),
  getBySubject: (subject) => api.get(`/tutors?subjects_like=${subject}`),
  getByLocation: (location) => api.get(`/tutors?location=${location}`),
  getTopRated: () => api.get("/tutors?_sort=rating&_order=desc&_limit=10"),
};

// Student APIs
export const studentAPI = {
  getAll: () => api.get("/students"),
  getById: (id) => api.get(`/students/${id}`),
  create: async (studentData) => {
    try {
      const nextId = await generateNextId("students");
      const studentWithId = {
        ...studentData,
        id: nextId,
      };
      return await api.post("/students", studentWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, studentData) => api.put(`/students/${id}`, studentData),
  delete: (id) => api.delete(`/students/${id}`),
};

// Schedule APIs
export const scheduleAPI = {
  getAll: () => api.get("/schedules"),
  getById: (id) => api.get(`/schedules/${id}`),
  create: async (scheduleData) => {
    try {
      const nextId = await generateNextId("schedules");
      const scheduleWithId = {
        ...scheduleData,
        id: nextId,
      };
      return await api.post("/schedules", scheduleWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, scheduleData) => api.put(`/schedules/${id}`, scheduleData),
  delete: (id) => api.delete(`/schedules/${id}`),
  getByTutor: (tutorId) => api.get(`/schedules?tutorId=${tutorId}`),
  getByStudent: (studentId) => api.get(`/schedules?studentId=${studentId}`),
  getByDate: (date) => api.get(`/schedules?date=${date}`),
  getByStatus: (status) => api.get(`/schedules?status=${status}`),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => api.get("/attendance"),
  getById: (id) => api.get(`/attendance/${id}`),
  create: async (attendanceData) => {
    try {
      const nextId = await generateNextId("attendance");
      const attendanceWithId = {
        ...attendanceData,
        id: nextId,
      };
      return await api.post("/attendance", attendanceWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, attendanceData) => api.put(`/attendance/${id}`, attendanceData),
  delete: (id) => api.delete(`/attendance/${id}`),
  getBySchedule: (scheduleId) =>
    api.get(`/attendance?scheduleId=${scheduleId}`),
  getByTutor: (tutorId) => api.get(`/attendance?tutorId=${tutorId}`),
  getByStudent: (studentId) => api.get(`/attendance?studentId=${studentId}`),
};

// Review APIs
export const reviewAPI = {
  getAll: () => api.get("/reviews"),
  getById: (id) => api.get(`/reviews/${id}`),
  create: async (reviewData) => {
    try {
      const nextId = await generateNextId("reviews");
      const reviewWithId = {
        ...reviewData,
        id: nextId,
      };
      return await api.post("/reviews", reviewWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
  getByTutor: (tutorId) => api.get(`/reviews?tutorId=${tutorId}`),
  getByStudent: (studentId) => api.get(`/reviews?studentId=${studentId}`),
  getTopRated: () => api.get("/reviews?_sort=rating&_order=desc&_limit=10"),
};

// Notification APIs
export const notificationAPI = {
  getAll: () => api.get("/notifications"),
  getById: (id) => api.get(`/notifications/${id}`),
  create: async (notificationData) => {
    try {
      const nextId = await generateNextId("notifications");
      const notificationWithId = {
        ...notificationData,
        id: nextId,
      };
      return await api.post("/notifications", notificationWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, notificationData) =>
    api.put(`/notifications/${id}`, notificationData),
  delete: (id) => api.delete(`/notifications/${id}`),
  getByUser: (userId) => api.get(`/notifications?userId=${userId}`),
  getUnread: (userId) =>
    api.get(`/notifications?userId=${userId}&isRead=false`),
  markAsRead: (id) => api.put(`/notifications/${id}`, { isRead: true }),
};

// Message APIs
export const messageAPI = {
  getAll: () => api.get("/messages"),
  getById: (id) => api.get(`/messages/${id}`),
  create: async (messageData) => {
    try {
      const nextId = await generateNextId("messages");
      const messageWithId = {
        ...messageData,
        id: nextId,
      };
      return await api.post("/messages", messageWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, messageData) => api.put(`/messages/${id}`, messageData),
  delete: (id) => api.delete(`/messages/${id}`),
  getByUser: (userId) =>
    api.get(`/messages?senderId=${userId}&receiverId=${userId}`),
  getConversation: (user1Id, user2Id) =>
    api.get(
      `/messages?senderId=${user1Id}&receiverId=${user2Id}&senderId=${user2Id}&receiverId=${user1Id}`
    ),
  markAsRead: (id) => api.put(`/messages/${id}`, { isRead: true }),
};

// Subject APIs
export const subjectAPI = {
  getAll: () => api.get("/subjects"),
  getById: (id) => api.get(`/subjects/${id}`),
  create: async (subjectData) => {
    try {
      const nextId = await generateNextId("subjects");
      const subjectWithId = {
        ...subjectData,
        id: nextId,
      };
      return await api.post("/subjects", subjectWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, subjectData) => api.put(`/subjects/${id}`, subjectData),
  delete: (id) => api.delete(`/subjects/${id}`),
};

// Location APIs
export const locationAPI = {
  getAll: () => api.get("/locations"),
  getById: (id) => api.get(`/locations/${id}`),
  create: async (locationData) => {
    try {
      const nextId = await generateNextId("locations");
      const locationWithId = {
        ...locationData,
        id: nextId,
      };
      return await api.post("/locations", locationWithId);
    } catch (error) {
      throw error;
    }
  },
  update: (id, locationData) => api.put(`/locations/${id}`, locationData),
  delete: (id) => api.delete(`/locations/${id}`),
};

export default api;
