import React from "react";
import { Box, Container, Grid, Typography, Link, Divider } from "@mui/material";
import { School, Email, Phone, LocationOn } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <School sx={{ mr: 1, color: "#1976d2" }} />
              <Typography variant="h6" color="text.primary" gutterBottom>
                Hệ thống thuê gia sư
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Nền tảng kết nối gia sư và học viên uy tín, chất lượng cao tại
              Việt Nam. Giúp bạn tìm kiếm gia sư phù hợp với nhu cầu học tập.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Liên kết nhanh
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Trang chủ
            </Link>
            <Link href="/tutors" color="inherit" display="block" sx={{ mb: 1 }}>
              Tìm gia sư
            </Link>
            <Link
              href="/register"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Đăng ký
            </Link>
            <Link href="/login" color="inherit" display="block" sx={{ mb: 1 }}>
              Đăng nhập
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Môn học
            </Typography>
            <Link
              href="/tutors?subject=math"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Toán học
            </Link>
            <Link
              href="/tutors?subject=physics"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Vật lý
            </Link>
            <Link
              href="/tutors?subject=chemistry"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Hóa học
            </Link>
            <Link
              href="/tutors?subject=english"
              color="inherit"
              display="block"
              sx={{ mb: 1 }}
            >
              Tiếng Anh
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Liên hệ
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                123 Nguyễn Văn Cừ, Q.5, TP.HCM
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                0123 456 789
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2" color="text.secondary">
                support@tutorsystem.com
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © 2024 Hệ thống thuê gia sư. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Link href="#" color="inherit" variant="body2">
              Chính sách bảo mật
            </Link>
            <Link href="#" color="inherit" variant="body2">
              Điều khoản sử dụng
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
