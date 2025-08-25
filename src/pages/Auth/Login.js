import React, { useState } from "react";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on user role
      const { role } = result.user;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "tutor") {
        navigate("/tutor/dashboard");
      } else if (role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Đăng nhập
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Đăng nhập"}
            </Button>

            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2">
                Chưa có tài khoản? Đăng ký ngay
              </Link>
            </Box>
          </Box>

          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "#f5f5f5", borderRadius: 1 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              gutterBottom
            >
              Tài khoản demo:
            </Typography>
            <Typography variant="body2" align="center">
              Admin: admin@tutorsystem.com / admin123
              <br />
              Gia sư: tutor1@example.com / tutor123
              <br />
              Học viên: student1@example.com / student123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
