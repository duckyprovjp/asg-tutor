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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Search as SearchIcon,
  Book as BookIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { scheduleAPI, tutorAPI, reviewAPI } from "../services/api";
import { useUserInfo } from "../utils/userUtils";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const { userId, isStudent } = useUserInfo();
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [allTutors, setAllTutors] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    subject: "",
    location: "",
    minRating: 0,
    maxPrice: "",
  });
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    loadData();
  }, []);
  useEffect(() => {
    tutorAPI.getAll().then((res) => {
      setAllTutors(res.data);
      setTutors(res.data);
    });
  }, []);

  const loadData = async () => {
    try {
      // Get student ID from current user
      const studentId = userId; // Get from current logged-in user

      const [schedulesRes, tutorsRes, reviewsRes] = await Promise.all([
        scheduleAPI.getByStudent(studentId),
        tutorAPI.getAll(),
        reviewAPI.getByStudent(studentId),
      ]);

      setSchedules(schedulesRes.data);
      setTutors(tutorsRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTutors = () => {
    const filteredTutors = allTutors.filter((tutor) => {
      const matchesSubject =
        !searchFilters.subject ||
        tutor.subjects?.some((subject) =>
          subject.toLowerCase().includes(searchFilters.subject.toLowerCase())
        );
      const matchesLocation =
        !searchFilters.location ||
        tutor.location
          ?.toLowerCase()
          .includes(searchFilters.location.toLowerCase());
      const matchesRating = tutor.rating >= searchFilters.minRating;
      const matchesPrice =
        !searchFilters.maxPrice ||
        tutor.hourlyRate <= parseInt(searchFilters.maxPrice);

      return matchesSubject && matchesLocation && matchesRating && matchesPrice;
    });

    setTutors(filteredTutors);
  };

  const handleOpenReviewDialog = (schedule) => {
    setSelectedSchedule(schedule);
    setReviewData({
      rating: 5,
      comment: "",
    });
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedSchedule(null);
    setReviewData({});
  };

  const handleSubmitReview = async () => {
    try {
      const reviewRecord = {
        tutorId: selectedSchedule.tutorId,
        studentId: selectedSchedule.studentId,
        scheduleId: selectedSchedule.id,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: new Date().toISOString(),
      };

      await reviewAPI.create(reviewRecord);
      handleCloseReviewDialog();
      loadData();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleViewTutorDetails = (tutorId) => {
    navigate(`/tutors/${tutorId}`);
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

  const completedSchedules = schedules
    .filter(
      (schedule) => schedule.date < new Date().toISOString().split("T")[0]
    )
    .slice(0, 3);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Bảng điều khiển Học sinh
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
                <BookIcon color="success" fontSize="large" />
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
                    Giáo viên đã học
                  </Typography>
                  <Typography variant="h4" component="div">
                    {new Set(schedules.map((s) => s.tutorId)).size}
                  </Typography>
                </Box>
                <SchoolIcon color="info" fontSize="large" />
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
                    Đánh giá đã viết
                  </Typography>
                  <Typography variant="h4" component="div">
                    {reviews.length}
                  </Typography>
                </Box>
                <StarIcon color="warning" fontSize="large" />
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
                      <TableCell>Giáo viên</TableCell>
                      <TableCell>Môn học</TableCell>
                      <TableCell>Trạng thái</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todaySchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>Giáo viên {schedule.tutorId}</TableCell>
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
                      <TableCell>Giáo viên</TableCell>
                      <TableCell>Môn học</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>{schedule.date}</TableCell>
                        <TableCell>
                          {schedule.startTime} - {schedule.endTime}
                        </TableCell>
                        <TableCell>Giáo viên {schedule.tutorId}</TableCell>
                        <TableCell>{schedule.subject}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Tutor Search */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tìm kiếm giáo viên
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Môn học"
              value={searchFilters.subject}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, subject: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Địa điểm"
              value={searchFilters.location}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, location: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Đánh giá tối thiểu</InputLabel>
              <Select
                value={searchFilters.minRating}
                onChange={(e) =>
                  setSearchFilters({
                    ...searchFilters,
                    minRating: e.target.value,
                  })
                }
                label="Đánh giá tối thiểu"
              >
                <MenuItem value={0}>Tất cả</MenuItem>
                <MenuItem value={4}>4+ sao</MenuItem>
                <MenuItem value={4.5}>4.5+ sao</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              label="Giá tối đa (VNĐ/giờ)"
              type="number"
              value={searchFilters.maxPrice}
              onChange={(e) =>
                setSearchFilters({ ...searchFilters, maxPrice: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SearchIcon />}
              onClick={handleSearchTutors}
              sx={{ height: "56px" }}
            >
              Tìm kiếm
            </Button>
          </Grid>
        </Grid>

        {/* Tutor Results */}
        <Grid container spacing={2}>
          {tutors.slice(0, 6).map((tutor) => (
            <Grid item xs={12} md={4} key={tutor.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>
                      {tutor.fullName?.charAt(0) || "G"}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{tutor.fullName}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {tutor.subjects?.join(", ")}
                      </Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating value={tutor.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      ({tutor.totalReviews} đánh giá)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" mb={2}>
                    {tutor.location} • {tutor.hourlyRate?.toLocaleString()}{" "}
                    VNĐ/giờ
                  </Typography>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewTutorDetails(tutor.id)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button size="small" variant="contained">
                      Đăng ký học
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Completed Classes for Review */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Buổi học đã hoàn thành
        </Typography>
        {completedSchedules.length === 0 ? (
          <Typography color="textSecondary">
            Chưa có buổi học nào hoàn thành
          </Typography>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Giáo viên</TableCell>
                  <TableCell>Môn học</TableCell>
                  <TableCell>Đánh giá</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {completedSchedules.map((schedule) => {
                  const hasReview = reviews.some(
                    (review) => review.scheduleId === schedule.id
                  );
                  return (
                    <TableRow key={schedule.id}>
                      <TableCell>{schedule.date}</TableCell>
                      <TableCell>Giáo viên {schedule.tutorId}</TableCell>
                      <TableCell>{schedule.subject}</TableCell>
                      <TableCell>
                        {hasReview ? (
                          <Chip
                            label="Đã đánh giá"
                            color="success"
                            size="small"
                          />
                        ) : (
                          <Chip
                            label="Chưa đánh giá"
                            color="warning"
                            size="small"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {!hasReview && (
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenReviewDialog(schedule)}
                          >
                            Đánh giá
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Đánh giá buổi học</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="textSecondary" mb={2}>
              Buổi học: {selectedSchedule?.subject} - {selectedSchedule?.date}
            </Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography component="legend">Đánh giá:</Typography>
              <Rating
                value={reviewData.rating}
                onChange={(event, newValue) => {
                  setReviewData({ ...reviewData, rating: newValue });
                }}
                sx={{ ml: 1 }}
              />
            </Box>
            <TextField
              fullWidth
              label="Nhận xét"
              multiline
              rows={4}
              value={reviewData.comment}
              onChange={(e) =>
                setReviewData({ ...reviewData, comment: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Hủy</Button>
          <Button onClick={handleSubmitReview} variant="contained">
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StudentDashboard;
