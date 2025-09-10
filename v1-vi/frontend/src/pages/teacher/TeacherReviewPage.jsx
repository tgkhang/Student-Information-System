"use client";

import {useState, useEffect} from "react";
import Page from "../../components/Page";
import CourseCardsView from "../../components/CourseCardsView";
import {
  Box,
  Grid2,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  Paper,
  Avatar,
  Rating,
  Chip,
  LinearProgress,
  Button,
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import useAuth from "../../hooks/useAuth";
import { getListRateForTeacher } from "../../utils/api";


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// Custom select component
export function CustomSelect({
  items = [],
  label = "Select",
  value,
  onChange,
  id = "custom-select",
  width = 120,
  required = false,
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box sx={{ minWidth: width }}>
      <FormControl
        sx={{ m: 1, minWidth: 120 }}
        size="small"
        required={required}
      >
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value || ""}
          label={label}
          autoWidth
          onChange={handleChange}
        >
          {items.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

// Review Summary component
function CourseReviewSummary({ course }) {
  const completionPercentage = (course?.DanhGiaList?.length / course?.SoLuongSinhVienDangKy) * 100;
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return (
    <Box sx={{ mb: 4 }}>
      
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          mb: 3,
          width: "100%"
        }}
      >

        <CardContent>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "primary.main"
            }}
          >
            {course?.MaKhoaHoc} ({course?.TenKhoaHoc})
          </Typography>

          <Grid2
            container spacing={3}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "5em"
            }}>
            <Grid2 item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="body2"
                  color="secondary.dark"
                  gutterBottom
                >
                  Review Completion
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={completionPercentage} 
                      sx={{ 
                        height: 8, 
                        borderRadius: 5,
                        backgroundColor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: completionPercentage >= 80 ? '#4caf50' : 
                                         completionPercentage >= 50 ? '#ff9800' : '#f44336'
                        }
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {completionPercentage.toFixed(0)}%
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  {course?.DanhGiaList?.length} of {course?.SoLuongSinhVienDangKy} reviews completed
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />} 
                  label={`Start: ${(course?.lichHoc?.ThoiGianBatDau)}`}
                  size="small"
                  sx={{ bgcolor: '#f0f7ff' }}
                />
                <Chip 
                  icon={<AccessTimeIcon fontSize="small" />} 
                  label={`Due: ${(course?.lichHoc?.ThoiGianKetThuc)}`}
                  size="small"
                  sx={{ bgcolor: '#fff4e5' }}
                />
                <Chip 
                  icon={<DateRangeIcon fontSize="small" />}
                  label={dayOfWeek[course?.lichHoc?.NgayHoc % 7]}
                  size="small"
                  sx={{ bgcolor: '#f0f7ff' }}
                />
              </Box>
            </Grid2>
            
            <Grid2 item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Average Rating
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>
                    {course?.TrungBinhSoSao?.toFixed(1) || "N/A"}
                  </Typography>
                  <Typography variant="h3" color="secondary.main">
                    / 5.0
                  </Typography>
                </Box>
                <Rating 
                  value={course?.TrungBinhSoSao || 0} 
                  precision={0.1} 
                  readOnly 
                  size="large"
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Based on {course?.DanhGiaList?.length} student reviews
                </Typography>
              </Box>
            </Grid2>

          </Grid2>

        </CardContent>

      </Card>

    </Box>
  );
}

export default function CourseReviewPage() {
  const [year, setYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [helpfulCounts, setHelpfulCounts] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const { user } = useAuth();
  const [classesData, setClassesData] = useState([]);
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
    setViewMode("detail");
  };

  const handleBackToGrid = () => {
    setViewMode("grid");
  };

  const handleHelpfulClick = (reviewId) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
  };
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getListRateForTeacher(user.username);
        console.log("Courses data:", res);
        setClassesData(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <Page title="Course Reviews">
      <Box sx={{ display: "flex" }}>

        <Box
          component="main"
          sx={{
            p: 3,
            mt: 8,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            backgroundColor: "primary.lighter",
            marginLeft:  0,
            width: "100%",
          }}
        >
          <Grid2
            container spacing={4}
            sx={{
              width: "100%",
              flexGrow: 1,
              maxWidth: "100%",
            }}
          >
            {/* Review Content Card */}
            <Grid2 item xs={12} sx={{ height: "100%", width: "100%" }}>
              <Card elevation={0} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  {/* Filter and Search Row */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    {/* Back button when in detail view */}
                    {viewMode === "detail" && (
                      <Box sx={{ mb: 1 }}>
                        <Button
                          startIcon={<ArrowBackIcon />}
                          onClick={handleBackToGrid}
                          sx={{ ml: -1 }}
                        >
                          Back to all courses
                        </Button>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          mb: 0,
                          fontWeight: "bold",
                          color: "primary.main",
                        }}
                      >
                        Course Reviews
                      </Typography>
                      {/* Filter controls - both on the right */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 1 }}>

                          <CustomSelect
                            items={["2020", "2021", "2022", "2023", "2024","2025"]}
                            label="Year"
                            id="year-select"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                          />
                        </Box>
                      </Box>
                    </Box>

                    {/* Full width search bar */}
                    <Box
                      sx={{
                        width: "100%",
                        mt: 1,
                      }}
                    >
                      <TextField
                        placeholder="Search courses..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{
                          width: "100%",
                        }}
                        InputProps={{
                          endAdornment: <SearchIcon />,
                        }}
                      />
                    </Box>
                  </Box>
                  {/* Grid View */}
                  {viewMode === "grid" && (
                    <CourseCardsView 
                      courses={classesData}
                      searchTerm={searchTerm}
                      year={year}
                      onSelectCourse={handleSelectCourse}
                    />
                  )}

                  {/* Detail View */}
                  {viewMode === "detail" && selectedCourse && (
                    <>
                      {/* Course summary section */}
                      <CourseReviewSummary course={selectedCourse} />
                      
                      {/* Reviews Table */}
                      {selectedCourse?.DanhGiaList && selectedCourse?.DanhGiaList?.length > 0 ? (
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{backgroundColor: "primary.main", color: "primary.lighter"}}>
                                  Student
                                </TableCell>
                                <TableCell sx={{backgroundColor: "primary.main", color: "primary.lighter"}}>
                                  Date
                                </TableCell>
                                <TableCell sx={{backgroundColor: "primary.main", color: "primary.lighter"}}>
                                  Rating
                                </TableCell>
                                <TableCell sx={{backgroundColor: "primary.main", color: "primary.lighter"}}>
                                  Comment
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedCourse?.DanhGiaList?.map((review, index) => (
                                <StyledTableRow key={index}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: "1rem" }}>
                                      <Avatar 
                                        sx={{ 
                                          bgcolor: 'primary.main', 
                                          width: 32, 
                                          height: 32, 
                                          mr: 1,
                                          fontSize: '0.8rem'
                                        }}
                                      >
                                        {review?.SinhVien?.HoTen[0]}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                                          {review?.SinhVien?.HoTen}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    {new Date(review?.ThoiGianDanhGia).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Rating value={review?.SoSao} precision={0.1} readOnly size="small" />
                                      <Typography variant="body2" sx={{ ml: 1, fontWeight: 'medium' }}>
                                        {review?.SoSao.toFixed(1)}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell sx={{ maxWidth: 350 }}>
                                    <Typography 
                                      variant="body2" 
                                      sx={{ 
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                      }}
                                    >
                                      {review?.DanhGia}
                                    </Typography>
                                  </TableCell>
                                </StyledTableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="text.secondary">
                            No reviews available for this course.
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Page>
  );
}