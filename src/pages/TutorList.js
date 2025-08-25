import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Button,
  Rating,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Slider,
  Paper,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  School as SchoolIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { tutorAPI, subjectAPI, locationAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const TutorList = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    minRating: 0,
    maxPrice: 1000000,
    searchQuery: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tutorsRes, subjectsRes, locationsRes] = await Promise.all([
        tutorAPI.getAll(),
        subjectAPI.getAll(),
        locationAPI.getAll(),
      ]);

      setTutors(tutorsRes.data);
      setSubjects(subjectsRes.data);
      setLocations(locationsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const filteredTutors = tutors.filter((tutor) => {
    const matchesSubject =
      !filters.subject ||
      tutor.subjects?.some((subject) =>
        subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    const matchesLocation =
      !filters.location ||
      tutor.location?.toLowerCase().includes(filters.location.toLowerCase());
    const matchesRating = tutor.rating >= filters.minRating;
    const matchesPrice = tutor.hourlyRate <= filters.maxPrice;
    const matchesSearch =
      !filters.searchQuery ||
      tutor.bio?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      tutor.subjects?.some((subject) =>
        subject.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );

    return (
      matchesSubject &&
      matchesLocation &&
      matchesRating &&
      matchesPrice &&
      matchesSearch
    );
  });

  const handleViewTutorDetails = (tutorId) => {
    navigate(`/tutors/${tutorId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Danh sách Giáo viên
      </Typography>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Tìm kiếm giáo viên"
              value={filters.searchQuery}
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Môn học</InputLabel>
              <Select
                value={filters.subject}
                onChange={(e) => handleFilterChange("subject", e.target.value)}
                label="Môn học"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {subjects.map((subject) => (
                  <MenuItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Địa điểm</InputLabel>
              <Select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                label="Địa điểm"
              >
                <MenuItem value="">Tất cả</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location.id} value={location.name}>
                    {location.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography gutterBottom>Đánh giá tối thiểu</Typography>
            <Slider
              value={filters.minRating}
              onChange={(e, value) => handleFilterChange("minRating", value)}
              min={0}
              max={5}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography gutterBottom>Giá tối đa (VNĐ/giờ)</Typography>
            <Slider
              value={filters.maxPrice}
              onChange={(e, value) => handleFilterChange("maxPrice", value)}
              min={0}
              max={1000000}
              step={50000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${(value / 1000).toFixed(0)}k`}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Results Count */}
      <Typography variant="h6" gutterBottom>
        Tìm thấy {filteredTutors.length} giáo viên
      </Typography>

      {/* Tutor Cards */}
      <Grid container spacing={3}>
        {filteredTutors.map((tutor) => (
          <Grid item xs={12} md={4} key={tutor.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                    {tutor.fullName?.charAt(0) || "G"}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {tutor.fullName}
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Rating value={tutor.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({tutor.totalReviews} đánh giá)
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <SchoolIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {tutor.subjects?.join(", ")}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <LocationIcon
                    fontSize="small"
                    sx={{ mr: 1, color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="textSecondary">
                    {tutor.location}
                  </Typography>
                </Box>

                <Typography variant="h6" color="primary" gutterBottom>
                  {tutor.hourlyRate?.toLocaleString()} VNĐ/giờ
                </Typography>

                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 2 }}
                >
                  {tutor.experience} kinh nghiệm • {tutor.education}
                </Typography>

                <Box display="flex" gap={1} sx={{ mt: "auto" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    onClick={() => handleViewTutorDetails(tutor.id)}
                  >
                    Xem chi tiết
                  </Button>
                  <Button size="small" variant="contained" fullWidth>
                    Đăng ký học
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredTutors.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="textSecondary">
            Không tìm thấy giáo viên nào phù hợp với tiêu chí tìm kiếm
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default TutorList;
