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
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { scheduleAPI, attendanceAPI, reviewAPI } from "../services/api";
import { useUserInfo } from "../utils/userUtils";

const TutorDashboard = () => {
  const { currentUser } = useAuth();
  const { userId, isTutor } = useUserInfo();
  const [schedules, setSchedules] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAttendanceDialog, setOpenAttendanceDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    checkInTime: "",
    checkOutTime: "",
    status: "completed",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get tutor ID from current user
      const tutorId = userId; // Get from current logged-in user

      const [schedulesRes, attendanceRes, reviewsRes] = await Promise.all([
        scheduleAPI.getByTutor(tutorId),
        attendanceAPI.getByTutor(tutorId),
        reviewAPI.getByTutor(tutorId),
      ]);

      setSchedules(schedulesRes.data);
      setAttendance(attendanceRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAttendanceDialog = (schedule) => {
    setSelectedSchedule(schedule);
    setAttendanceData({
      checkInTime: new Date().toISOString().slice(0, 16),
      checkOutTime: "",
      status: "completed",
      notes: "",
    });
    setOpenAttendanceDialog(true);
  };

  const handleCloseAttendanceDialog = () => {
    setOpenAttendanceDialog(false);
    setSelectedSchedule(null);
    setAttendanceData({});
  };

  const handleSaveAttendance = async () => {
    try {
      const attendanceRecord = {
        scheduleId: selectedSchedule.id,
        tutorId: selectedSchedule.tutorId,
        studentId: selectedSchedule.studentId,
        checkInTime: attendanceData.checkInTime,
        checkOutTime: attendanceData.checkOutTime || attendanceData.checkInTime,
        status: attendanceData.status,
        notes: attendanceData.notes,
      };

      await attendanceAPI.create(attendanceRecord);
      handleCloseAttendanceDialog();
      loadData();
    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Đã xác nhận";
      case "pending":
        return "Chờ xác nhận";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const todaySchedules = schedules.filter(
    (schedule) => schedule.date === new Date().toISOString().split("T")[0]
  );

  const upcomingSchedules = schedules
    .filter(
      (schedule) => schedule.date > new Date().toISOString().split("T")[0]
    )
    .slice(0, 5);

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển Giáo viên
      </Typography>

      {/* Welcome Section */}
      <Alert severity="info" sx={{ mb: 3 }}>
        Chào mừng {currentUser?.fullName}! Hôm nay bạn có{" "}
        {todaySchedules.length} buổi học.
      </Alert>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Buổi học hôm nay
                  </Typography>
                  <Typography variant="h4" component="div">
                    {todaySchedules.length}
                  </Typography>
                </Box>
                <ScheduleIcon color="primary" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng buổi học
                  </Typography>
                  <Typography variant="h4" component="div">
                    {schedules.length}
                  </Typography>
                </Box>
                <PeopleIcon color="success" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Đánh giá trung bình
                  </Typography>
                  <Typography variant="h4" component="div">
                    {averageRating}
                  </Typography>
                </Box>
                <StarIcon color="warning" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Tổng đánh giá
                  </Typography>
                  <Typography variant="h4" component="div">
                    {reviews.length}
                  </Typography>
                </Box>
                <StarIcon color="info" fontSize="large" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Today's Schedule */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lịch học hôm nay
            </Typography>
            {todaySchedules.length === 0 ? (
              <Typography color="textSecondary">
                Không có buổi học nào hôm nay
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Học sinh</TableCell>
                      <TableCell>Môn học</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaySchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>Học sinh {schedule.studentId}</TableCell>
                        <TableCell>{schedule.subject}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(schedule.status)}
                            color={getStatusColor(schedule.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenAttendanceDialog(schedule)}
                            color="primary"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Upcoming Schedule */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lịch học sắp tới
            </Typography>
            {upcomingSchedules.length === 0 ? (
              <Typography color="textSecondary">
                Không có buổi học nào sắp tới
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày</TableCell>
                      <TableCell>Thời gian</TableCell>
                      <TableCell>Học sinh</TableCell>
                      <TableCell>Môn học</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.date}</TableCell>
                        <TableCell>
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>Học sinh {schedule.studentId}</TableCell>
                        <TableCell>{schedule.subject}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(schedule.status)}
                            color={getStatusColor(schedule.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Reviews */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Đánh giá gần đây
        </Typography>
        {reviews.length === 0 ? (
          <Typography color="textSecondary">Chưa có đánh giá nào</Typography>
        ) : (
          <Grid container spacing={2}>
            {reviews.slice(0, 3).map((review) => (
              <Grid item xs={12} md={4} key={review.id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <StarIcon color="warning" />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        {review.rating}/5
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      {review.comment}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Attendance Dialog */}
      <Dialog
        open={openAttendanceDialog}
        onClose={handleCloseAttendanceDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Điểm danh buổi học</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Thời gian bắt đầu"
              type="datetime-local"
              value={attendanceData.checkInTime}
              onChange={(e) =>
                setAttendanceData({
                  ...attendanceData,
                  checkInTime: e.target.value,
                })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Thời gian kết thúc"
              type="datetime-local"
              value={attendanceData.checkOutTime}
              onChange={(e) =>
                setAttendanceData({
                  ...attendanceData,
                  checkOutTime: e.target.value,
                })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Ghi chú"
              multiline
              rows={3}
              value={attendanceData.notes}
              onChange={(e) =>
                setAttendanceData({ ...attendanceData, notes: e.target.value })
              }
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAttendanceDialog}>Hủy</Button>
          <Button onClick={handleSaveAttendance} variant="contained">
            Lưu điểm danh
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TutorDashboard;
