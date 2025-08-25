import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
} from "@mui/material";
import {
  AccountCircle,
  School,
  Home,
  Search,
  Dashboard,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin, isTutor, isStudent } =
    useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate("/");
  };

  const handleProfile = () => {
    if (isTutor()) {
      navigate("/tutor/profile");
    } else if (isStudent()) {
      navigate("/student/profile");
    } else if (isAdmin()) {
      navigate("/admin/dashboard");
    }
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Container maxWidth="lg">
        <Toolbar>
          <School sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Hệ thống thuê gia sư
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate("/")}
            >
              Trang chủ
            </Button>

            <Button
              color="inherit"
              startIcon={<Search />}
              onClick={() => navigate("/tutors")}
            >
              Tìm gia sư
            </Button>

            {isAuthenticated ? (
              <>
                {isAdmin() && (
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    Quản trị
                  </Button>
                )}

                {isTutor() && (
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate("/tutor/dashboard")}
                  >
                    Bảng điều khiển
                  </Button>
                )}

                {isStudent() && (
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate("/student/dashboard")}
                  >
                    Bảng điều khiển
                  </Button>
                )}

                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  {user?.avatar ? (
                    <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircle />
                  )}
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleProfile}>Hồ sơ cá nhân</MenuItem>
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Đăng nhập
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
