"use client";
import React, { useState, useEffect } from "react";
import Page from "../../components/Page";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ClearIcon from "@mui/icons-material/Clear";
import { getFacultyListApi, getCoursesListApi, createNotificationApi } from "../../utils/api";

export default function AdminCreateNotificationPage() {
  // Basic notification state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  
  // Target group state
  const [targetGroup, setTargetGroup] = useState("");
  const [nienKhoa, setNienKhoa] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [courseId, setCourseId] = useState("");
  
  // Data lists for dropdowns
  const [nienKhoaList, setNienKhoaList] = useState(["K20", "K21", "K22", "K23", "K24"]);
  const [facultyList, setFacultyList] = useState([]);
  const [courseList, setCourseList] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [facultyLoading, setFacultyLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  
  // Notification state
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const maxCharCount = 500;

  // Fetch faculty list on component mount
  useEffect(() => {
    const fetchFaculties = async () => {
      setFacultyLoading(true);
      try {
        const facultyResponse = await getFacultyListApi({
          page: 1,
          size: 100,
          sort: "TenKhoa",
          order: "asc",
        });
        
        if (facultyResponse?.data?.data) {
          setFacultyList(facultyResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
        setSnackbarMessage("Failed to load faculties");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      } finally {
        setFacultyLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  // Fetch courses when needed
  useEffect(() => {
    if (targetGroup === "KhoaHoc") {
      const fetchCourses = async () => {
        setCourseLoading(true);
        try {
          const coursesResponse = await getCoursesListApi({
            pageSize: 100,
            pageNumber: 1,
            sortBy: "id",
            sortOrder: "asc",
          });
          
          if (coursesResponse?.data?.data) {
            setCourseList(coursesResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
          setSnackbarMessage("Failed to load courses");
          setSnackbarSeverity("error");
          setShowSnackbar(true);
        } finally {
          setCourseLoading(false);
        }
      };

      fetchCourses();
    }
  }, [targetGroup]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleMessageChange = (e) => {
    const text = e.target.value;
    setMessage(text);
    setCharCount(text.length);
  };

  const handleTargetGroupChange = (e) => {
    setTargetGroup(e.target.value);
    setNienKhoa("");
    setFacultyId("");
    setCourseId("");
  };

  const handleClearForm = () => {
    setTitle("");
    setMessage("");
    setCharCount(0);
    setTargetGroup("");
    setNienKhoa("");
    setFacultyId("");
    setCourseId("");
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const isFormValid = () => {
    console.log(title);
    console.log(message);

    if (!title.trim() || !message.trim() || charCount > maxCharCount || !targetGroup) {
      return false;
    }

    // Check required fields based on target group
    switch (targetGroup) {
      case "NienKhoa":
        return !!nienKhoa;
      case "Khoa":
        return !!facultyId;
      case "KhoaHoc":
        return !!courseId;
      case "SinhVien":
      case "GiangVien":
        // These can be sent with or without facultyId
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      const missingField = !targetGroup 
        ? "target group" 
        : targetGroup === "Khóa" && !nienKhoa 
          ? "Khóa" 
          : targetGroup === "Khoa" && !facultyId 
            ? "faculty/department" 
            : targetGroup === "Khóa học" && !courseId 
              ? "course" 
              : "";
      
      setSnackbarMessage(`Please complete all required fields${missingField ? ` (missing ${missingField})` : ""}`);
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    // Prepare notification data
    const notificationData = {
      TenThongBao: title,
      NoiDung: message,
      NhomGui: targetGroup,
    };

    if (targetGroup === "NienKhoa") {
      notificationData.Khoa = nienKhoa;
    } else if (["SinhVien", "GiangVien", "Khoa"].includes(targetGroup) && facultyId) {
      notificationData.KhoaID = facultyId;
    } else if (targetGroup === "KhoaHoc") {
      notificationData.KhoaHocID = courseId;
    }

    setLoading(true);
    try {
      const response= await createNotificationApi(notificationData);
      console.log("Notification sent:", response.data);
      setSnackbarMessage("Notification sent successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
      handleClearForm();
    } catch (error) {
      console.error("Error sending notification:", error);
      const errorMessage = error.response?.data?.message || "Failed to send notification";
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render the secondary selection based on target group
  const renderSecondarySelection = () => {
    switch (targetGroup) {
      case "NienKhoa":
        return (
          <FormControl fullWidth required>
            <InputLabel id="nienkhoa-label">Year</InputLabel>
            <Select
              labelId="nienkhoa-label"
              id="nienkhoa-select"
              value={nienKhoa}
              label="Khóa"
              onChange={(e) => setNienKhoa(e.target.value)}
            >
              {nienKhoaList.map((khoa) => (
                <MenuItem key={khoa} value={khoa}>
                  {khoa}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the year to notify</FormHelperText>
          </FormControl>
        );
      
      case "SinhVien":
      case "GiangVien":
      case "Khoa":
        return (
          <FormControl fullWidth>
            <InputLabel id="faculty-label">Faculty (Optional)</InputLabel>
            <Select
              labelId="faculty-label"
              id="faculty-select"
              value={facultyId}
              label="Faculty/Department (Optional)"
              onChange={(e) => setFacultyId(e.target.value)}
              disabled={facultyLoading}
            >
              <MenuItem value="">
                <em>All Faculties</em>
              </MenuItem>
              {facultyList.map((faculty) => (
                <MenuItem key={faculty._id} value={faculty._id}>
                  {faculty.TenKhoa}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>
              {targetGroup === "Khoa" 
                ? "Select the faculty/department to notify (required)" 
                : "Leave empty to notify all, or select specific faculty/department"}
            </FormHelperText>
            {facultyLoading && (
              <CircularProgress size={24} sx={{ position: 'absolute', right: 8, top: 16 }} />
            )}
          </FormControl>
        );
      
      case "KhoaHoc":
        return (
          <FormControl fullWidth required>
            <InputLabel id="course-label">Course</InputLabel>
            <Select
              labelId="course-label"
              id="course-select"
              value={courseId}
              label="Course"
              onChange={(e) => setCourseId(e.target.value)}
              disabled={courseLoading}
            >
              {courseList.map((course) => (
                <MenuItem key={course._id} value={course._id}>
                  {course.TenKhoaHoc || course.CourseId}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Select the course to notify</FormHelperText>
            {courseLoading && (
              <CircularProgress size={24} sx={{ position: 'absolute', right: 8, top: 16 }} />
            )}
          </FormControl>
        );
      
      default:
        return null;
    }
  };

  return (
    <Page title="Create Notifications">
      <Box
        sx={{
          py: 2,
          mt: "64px"
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 800,
            mx: "auto",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <NotificationsActiveIcon
              sx={{ mr: 2, color: "primary.main", fontSize: 32 }}
            />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Broadcast Notifications
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <TextField
                required
                fullWidth
                id="notification-title"
                label="Notification Title"
                value={title}
                onChange={handleTitleChange}
                variant="outlined"
                placeholder="Enter a clear and concise title"
                InputProps={{
                  endAdornment: title && (
                    <IconButton
                      size="small"
                      onClick={() => setTitle("")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  ),
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    fontWeight: 600,
                    fontSize: "1.5rem",
                  },
                  "& .MuiInputBase-input::placeholder": {
                    fontWeight: 600,
                    fontSize: "1.5rem",
                  },
                  "& .MuiInputLabel-root": {
                    fontWeight: 600,
                    fontSize: "1.5rem",
                  },
                  "& .MuiInputLabel-shrink": {
                    fontSize: "1rem",
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="target-group-label">Target Group</InputLabel>
                <Select
                  labelId="target-group-label"
                  id="target-group-select"
                  value={targetGroup}
                  label="Target Group"
                  onChange={handleTargetGroupChange}
                >
                  <MenuItem value="NienKhoa">Years</MenuItem>
                  <MenuItem value="SinhVien">Students</MenuItem>
                  <MenuItem value="GiangVien">Lecturers</MenuItem>
                  <MenuItem value="Khoa">Faculties</MenuItem>
                  <MenuItem value="KhoaHoc">Courses</MenuItem>
                </Select>
                <FormHelperText>Select who should receive this notification</FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {renderSecondarySelection()}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                id="notification-message"
                label="Notification Message"
                multiline
                rows={8}
                value={message}
                onChange={handleMessageChange}
                variant="outlined"
                placeholder="Enter the notification message here..."
                helperText={`${charCount}/${maxCharCount} characters`}
                error={charCount > maxCharCount}
                FormHelperTextProps={{
                  sx: {
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: 0,
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleClearForm}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color={"primary"}
                  onClick={handleSubmit}
                  endIcon={loading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                  disabled={
                    !isFormValid() || loading
                  }
                >
                  {loading ? "Sending..." : "Send Notification"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
}