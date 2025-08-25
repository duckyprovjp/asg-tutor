import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  Button,
  Divider,
  Grid,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { messageAPI } from "../services/api";

const Messages = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await messageAPI.getByUser(currentUser.id);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const messageData = {
        senderId: currentUser.id,
        receiverId: selectedConversation.id,
        content: newMessage,
        createdAt: new Date().toISOString(),
        isRead: false,
      };

      await messageAPI.create(messageData);
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Tin nhắn
      </Typography>

      <Grid container spacing={2} sx={{ height: "70vh" }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: "100%" }}>
            <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
              <Typography variant="h6">Cuộc trò chuyện</Typography>
            </Box>
            <List sx={{ height: "calc(100% - 60px)", overflow: "auto" }}>
              {messages.length === 0 ? (
                <ListItem>
                  <ListItemText
                    primary="Không có tin nhắn nào"
                    secondary="Bắt đầu cuộc trò chuyện mới"
                  />
                </ListItem>
              ) : (
                messages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    <ListItem
                      button
                      selected={selectedConversation?.id === message.id}
                      onClick={() => setSelectedConversation(message)}
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {message.senderId === currentUser.id ? "B" : "A"}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          message.senderId === currentUser.id
                            ? "Bạn"
                            : "Người khác"
                        }
                        secondary={message.content}
                      />
                    </ListItem>
                    {index < messages.length - 1 && <Divider />}
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>

        {/* Message Area */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            {selectedConversation ? (
              <>
                {/* Message Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
                  <Typography variant="h6">
                    Cuộc trò chuyện với{" "}
                    {selectedConversation.senderId === currentUser.id
                      ? "Bạn"
                      : "Người khác"}
                  </Typography>
                </Box>

                {/* Messages */}
                <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
                  <Box
                    sx={{
                      backgroundColor: "primary.main",
                      color: "white",
                      p: 1,
                      borderRadius: 1,
                      mb: 1,
                      maxWidth: "70%",
                      alignSelf: "flex-end",
                    }}
                  >
                    <Typography variant="body2">
                      {selectedConversation.content}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {new Date(selectedConversation.createdAt).toLocaleString(
                        "vi-VN"
                      )}
                    </Typography>
                  </Box>
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                  <Grid container spacing={1}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        placeholder="Nhập tin nhắn..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <SendIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h6" color="textSecondary">
                  Chọn một cuộc trò chuyện để bắt đầu
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Messages;
