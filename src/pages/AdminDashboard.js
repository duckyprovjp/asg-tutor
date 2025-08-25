import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { userAPI, tutorAPI, scheduleAPI } from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTutors: 0,
    totalStudents: 0,
    totalSchedules: 0,
  });
  const [users, setUsers] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, tutorsRes, schedulesRes] = await Promise.all([
        userAPI.getAll(),
        tutorAPI.getAll(),
        scheduleAPI.getAll(),
      ]);

      const usersData = usersRes.data;
      const tutorsData = tutorsRes.data;
      const schedulesData = schedulesRes.data;

      setUsers(usersData);
      setTutors(tutorsData);
      setSchedules(schedulesData);

      setStats({
        totalUsers: usersData.length,
        totalTutors: tutorsData.length,
        totalStudents: usersData.filter((u) => u.role === "student").length,
        totalSchedules: schedulesData.length,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setFormData(item || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      if (dialogType === "user") {
        if (selectedItem) {
          await userAPI.update(selectedItem.id, formData);
        } else {
          await userAPI.create(formData);
        }
      } else if (dialogType === "tutor") {
        if (selectedItem) {
          await tutorAPI.update(selectedItem.id, formData);
        } else {
          await tutorAPI.create(formData);
        }
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const handleDelete = async (type, id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        if (type === "user") {
          await userAPI.delete(id);
        } else if (type === "tutor") {
          await tutorAPI.delete(id);
        }
        loadData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box sx={{ color: color }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển Quản trị viên
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tổng người dùng"
            value={stats.totalUsers}
            icon={<PeopleIcon fontSize="large" />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Giáo viên"
            value={stats.totalTutors}
            icon={<SchoolIcon fontSize="large" />}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Học sinh"
            value={stats.totalStudents}
            icon={<PeopleIcon fontSize="large" />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lịch học"
            value={stats.totalSchedules}
            icon={<ScheduleIcon fontSize="large" />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Users Management */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Quản lý người dùng</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("user")}
              >
                Thêm người dùng
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Vai trò</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.slice(0, 5).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={
                            user.role === "admin"
                              ? "Quản trị"
                              : user.role === "tutor"
                              ? "Giáo viên"
                              : "Học sinh"
                          }
                          color={
                            user.role === "admin"
                              ? "error"
                              : user.role === "tutor"
                              ? "success"
                              : "info"
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog("user", user)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete("user", user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Tutors Management */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">Quản lý giáo viên</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("tutor")}
              >
                Thêm giáo viên
              </Button>
            </Box>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tên</TableCell>
                    <TableCell>Môn học</TableCell>
                    <TableCell>Đánh giá</TableCell>
                    <TableCell>Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tutors.slice(0, 5).map((tutor) => (
                    <TableRow key={tutor.id}>
                      <TableCell>{tutor.bio}</TableCell>
                      <TableCell>{tutor.subjects?.join(", ")}</TableCell>
                      <TableCell>{tutor.rating}/5</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog("tutor", tutor)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete("tutor", tutor.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog for Add/Edit */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? "Chỉnh sửa" : "Thêm mới"}{" "}
          {dialogType === "user" ? "người dùng" : "giáo viên"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {dialogType === "user" && (
              <>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  value={formData.fullName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Vai trò</InputLabel>
                  <Select
                    value={formData.role || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    label="Vai trò"
                  >
                    <MenuItem value="admin">Quản trị viên</MenuItem>
                    <MenuItem value="tutor">Giáo viên</MenuItem>
                    <MenuItem value="student">Học sinh</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
            {dialogType === "tutor" && (
              <>
                <TextField
                  fullWidth
                  label="Mô tả"
                  value={formData.bio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  margin="normal"
                  multiline
                  rows={3}
                />
                <TextField
                  fullWidth
                  label="Môn học"
                  value={formData.subjects?.join(", ") || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      subjects: e.target.value.split(", "),
                    })
                  }
                  margin="normal"
                  helperText="Nhập các môn học, phân cách bằng dấu phẩy"
                />
                <TextField
                  fullWidth
                  label="Giá mỗi giờ (VNĐ)"
                  value={formData.hourlyRate || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hourlyRate: parseInt(e.target.value),
                    })
                  }
                  margin="normal"
                  type="number"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
