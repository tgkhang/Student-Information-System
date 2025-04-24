"use client";
import React, { useEffect, useState } from "react";
import Page from "../../components/Page";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BookIcon from "@mui/icons-material/Book";
import {
  createCourseApi,
  getFacultyListApi,
  getTeacherListApi,
} from "../../utils/api";

export default function CourseAddingPage() {
  // Course basic info
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [credits, setCredits] = useState(3);
  const [courseCapacity, setCourseCapacity] = useState(30);
  
  // Date fields (using simple text fields)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [registrationDeadline, setRegistrationDeadline] = useState("");
  
  // Faculty and teacher
  const [faculties, setFaculties] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  // Form state
  const [charCount, setCharCount] = useState(0);
  const maxCharCount = 1000;
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Load faculties when component mounts
  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response =  await getFacultyListApi({
          page: 1,
          size: 100,
          sort: "TenKhoa",
          order: "asc",
        });
        if (response && response.data && response.data.data) {
          setFaculties(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching faculties:", error);
        setSnackbarMessage("Failed to load faculties");
        setSnackbarSeverity("error");
        setShowSnackbar(true);
      }
    };
    
    fetchFaculties();
  }, []);

// Load teachers when faculty is selected
useEffect(() => {
  const fetchTeachers = async () => {
    if (!selectedFaculty) return;
    
    setIsLoading(true);
    try {
      const response = await getTeacherListApi({
        page: 1,
        size: 100,
        sort: "HoTen",
        order: "asc",
        KhoaID: selectedFaculty
      });
      
      if (response && response.data && response.data.data) {
        setTeachers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      setSnackbarMessage("Failed to load teachers");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  fetchTeachers();
}, [selectedFaculty]);

  // Handle faculty change
  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setSelectedFaculty(facultyId);
    setSelectedTeacher(null);
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setCourseDescription(text);
    setCharCount(text.length);
  };

  // Clear form
  const handleClearForm = () => {
    setCourseTitle("");
    setCourseDescription("");
    setCredits(3);
    setCourseCapacity(30);
    setStartDate("");
    setEndDate("");
    setRegistrationDeadline("");
    setSelectedFaculty("");
    setSelectedTeacher(null);
    setCharCount(0);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Form validation
    if (!courseTitle.trim()) {
      setSnackbarMessage("Please enter the course title");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (!selectedFaculty) {
      setSnackbarMessage("Please select a faculty");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (!selectedTeacher) {
      setSnackbarMessage("Please select a lecturer");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (!startDate || !endDate || !registrationDeadline) {
      setSnackbarMessage("Please provide all required dates");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    setIsLoading(true);
    try {
      // Prepare course data matching the API requirements
      const courseData = {
        TenKhoaHoc: courseTitle,
        GiangVienID: selectedTeacher._id,
        SoTinChi: credits,
        MoTa: courseDescription || "",
        SoLuongToiDa: courseCapacity,
        HanDangKy: new Date(registrationDeadline).toISOString(),
        NgayBatDau: new Date(startDate).toISOString(),
        NgayKetThuc: new Date(endDate).toISOString(),
        KhoaID: selectedFaculty
      };

      const response = await createCourseApi(courseData);
      
      setSnackbarMessage("Course added successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
      handleClearForm();
    } catch (error) {
      console.error("Error adding course:", error);
      setSnackbarMessage(error.response?.data?.message || "Failed to add course.");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Page title="Add Course">
      <Box
        sx={{
          p: 2,
          mt: "64px"
        }}  
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 1200,
            mx: "auto",
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <SchoolIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "primary.main",
              }}
            >
              Add Course
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Course Basic Information */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: "primary.main"
            }}
          >
            <BookIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Course Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                id="course-title"
                label="Course Name"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                variant="outlined"
                placeholder="Course Name"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel id="credits-label">Credits</InputLabel>
                <Select
                  labelId="credits-label"
                  id="credits-select"
                  value={credits}
                  label="Credits"
                  onChange={(e) => setCredits(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map((value) => (
                    <MenuItem key={value} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                id="course-capacity"
                label="Capacity"
                type="number"
                value={courseCapacity}
                onChange={(e) => setCourseCapacity(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="course-description"
                label="Course Description"
                multiline
                rows={4}
                value={courseDescription}
                onChange={handleDescriptionChange}
                variant="outlined"
                placeholder="Input detailed course description..."
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
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Faculty and Teacher Selection */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 500,
              color: "primary.main"
            }}
          >
            <PersonAddIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Faculty and Lecturer
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="faculty-label">Faculty</InputLabel>
                <Select
                  labelId="faculty-label"
                  id="faculty-select"
                  value={selectedFaculty}
                  label="Faculty"
                  onChange={handleFacultyChange}
                >
                  {faculties.map((faculty) => (
                    <MenuItem key={faculty._id} value={faculty._id}>
                      {faculty.TenKhoa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                id="teachers-autocomplete"
                options={teachers || []}
                getOptionLabel={(option) => option.HoTen || ""}
                value={selectedTeacher}
                onChange={(event, newValue) => {
                  setSelectedTeacher(newValue);
                }}
                loading={isLoading}
                disabled={!selectedFaculty}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Lecturer"
                    variant="outlined"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Course Schedule */}
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              fontWeight: 500,
              color: "primary.main"
            }}
          >
            <CalendarMonthIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Schedule
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="start-date"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="end-date"
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                id="registration-deadline"
                label="Registration Deadline"
                type="date"
                value={registrationDeadline}
                onChange={(e) => setRegistrationDeadline(e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
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
              color="primary"
              onClick={handleSubmit}
              endIcon={isLoading ? null : <SaveIcon />}
              disabled={isLoading || !courseTitle.trim() || !selectedFaculty || !selectedTeacher}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "Add Course"}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
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