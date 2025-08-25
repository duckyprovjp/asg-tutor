import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Avatar,
  Button,
  Rating,
  Chip,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Schedule as ScheduleIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { userAPI, reviewAPI } from "../services/api";

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTutorData();
  }, [id]);

  const loadTutorData = async () => {
    try {
      const [tutorRes, reviewsRes] = await Promise.all([
        userAPI.getById(id),
        reviewAPI.getByTutor(id),
      ]);

      setTutor(tutorRes.data);
      setReviews(reviewsRes.data);
    } catch (error) {
      console.error("Error loading tutor data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!tutor) {
    return <div>Tutor not found</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom>
          Thông tin Giáo viên
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {/* Tutor Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar sx={{ width: 120, height: 120, mx: "auto", mb: 2 }}>
              {tutor.fullName?.charAt(0) || "G"}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {tutor.fullName}
            </Typography>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={1}
            >
              <Rating value={tutor.rating} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({tutor.totalReviews} đánh giá)
              </Typography>
            </Box>
            <Typography variant="h6" color="primary" gutterBottom>
              {tutor.hourlyRate?.toLocaleString()} VNĐ/giờ
            </Typography>
            <Button variant="contained" fullWidth sx={{ mb: 2 }}>
              Đăng ký học
            </Button>
            <Button variant="outlined" fullWidth>
              Nhắn tin
            </Button>
          </Paper>
        </Grid>

        {/* Tutor Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Thông tin chi tiết
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SchoolIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="textSecondary">
                    Môn học: {tutor.subjects?.join(", ")}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocationIcon sx={{ mr: 1, color: "text.secondary" }} />
                  <Typography variant="body2" color="textSecondary">
                    Địa điểm: {tutor.location}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Kinh nghiệm: {tutor.experience}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  Học vấn: {tutor.education}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Mô tả
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {tutor.bio || "Chưa có mô tả"}
            </Typography>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Đánh giá ({reviews.length})
            </Typography>
            {reviews.length === 0 ? (
              <Typography color="textSecondary">
                Chưa có đánh giá nào
              </Typography>
            ) : (
              <Box>
                {reviews.slice(0, 3).map((review) => (
                  <Card key={review.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{review.comment}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TutorProfile;
