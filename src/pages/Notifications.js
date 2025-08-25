import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Message as MessageIcon,
  Info as InfoIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { notificationAPI } from "../services/api";

const Notifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getByUser(currentUser.id);
      setNotifications(response.data);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      loadNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "schedule_reminder":
        return <ScheduleIcon />;
      case "new_message":
        return <MessageIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "schedule_reminder":
        return "primary";
      case "new_message":
        return "success";
      default:
        return "default";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Thông báo
      </Typography>

      <Paper>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="Không có thông báo nào"
                secondary="Bạn sẽ nhận được thông báo khi có hoạt động mới"
              />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  sx={{
                    backgroundColor: notification.isRead
                      ? "transparent"
                      : "action.hover",
                  }}
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        {notification.title}
                        {!notification.isRead && (
                          <Chip
                            label="Mới"
                            size="small"
                            color={getNotificationColor(notification.type)}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(notification.createdAt).toLocaleString(
                            "vi-VN"
                          )}
                        </Typography>
                      </Box>
                    }
                  />
                  {!notification.isRead && (
                    <IconButton
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default Notifications;
