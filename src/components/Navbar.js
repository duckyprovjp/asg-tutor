import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Message as MessageIcon,
  AccountCircle,
  ExitToApp,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleClose();
  };

  const getRoleDisplayName = (role) => {
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Hệ thống Gia sư
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotificationMenu}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Messages */}
          <IconButton color="inherit" onClick={() => navigate("/messages")}>
            <Badge badgeContent={1} color="error">
              <MessageIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {currentUser?.fullName?.charAt(0) || "U"}
            </Avatar>
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "bottom",
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
            <MenuItem disabled>
              <Box>
                <Typography variant="subtitle2">
                  {currentUser?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {getRoleDisplayName(currentUser?.role)}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/profile");
                handleClose();
              }}
            >
              <AccountCircle sx={{ mr: 1 }} />
              Hồ sơ
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/dashboard");
                handleClose();
              }}
            >
              <Settings sx={{ mr: 1 }} />
              Bảng điều khiển
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ExitToApp sx={{ mr: 1 }} />
              Đăng xuất
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationClose}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 },
            }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle2">Thông báo</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                navigate("/notifications");
                handleNotificationClose();
              }}
            >
              <Typography variant="body2">
                Bạn có buổi học Toán vào ngày mai lúc 14:00
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/notifications");
                handleNotificationClose();
              }}
            >
              <Typography variant="body2">
                Thầy Nguyễn Văn A đã gửi tin nhắn cho bạn
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                navigate("/notifications");
                handleNotificationClose();
              }}
            >
              <Typography variant="body2">
                Buổi học Hóa đã được xác nhận
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
