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
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ClearIcon from "@mui/icons-material/Clear";
import WorkIcon from "@mui/icons-material/Work";
import ContactMailIcon from "@mui/icons-material/ContactMail";

import { addTeacherApi, getFacultyListApi } from "../../utils/api"; 
var designations = ["Trưởng khoa", "Phó trưởng khoa", "Giảng viên"];

export default function AddTeacherPage() {
  // Personal Information
  const [photoPreview, setPhotoPreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Professional Details
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  
  // Faculty data
  const [faculties, setFaculties] = useState([]);
  const [khoaID, setKhoaID] = useState("");
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

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

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleSubmit = async () => {
    // Basic validation
    if (!firstName.trim() || !lastName.trim()) {
      setSnackbarMessage("Please provide first and last name");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (!khoaID) {
      setSnackbarMessage("Please select a faculty");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    if (!designation) {
      setSnackbarMessage("Please select a designation");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
      return;
    }

    // Prepare the data according to the API requirements
    const teacherData = {
      HoTen: `${firstName} ${lastName}`.trim(),
      ChucVu: designation,
      KhoaID: khoaID
    };

    try {
      setIsLoading(true);
      
      // Call the API to add a teacher
      const response = await addTeacherApi(teacherData);
      
      setSnackbarMessage("Teacher added successfully!");
      setSnackbarSeverity("success");
      setShowSnackbar(true);
      handleClearForm();
    } catch (error) {
      console.error("Error adding teacher:", error);
      setSnackbarMessage(error.response?.data?.message || "Failed to add teacher");
      setSnackbarSeverity("error");
      setShowSnackbar(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearForm = () => {
    setPhotoPreview(null);
    setFirstName("");
    setLastName("");
    setEmail("");
    setEmployeeId("");
    setDepartment("");
    setDesignation("");
    setKhoaID("");
  };

  return (
    <Page title="Append Teacher">
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 1200,
          mx: "auto",
          mt: 10,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <WorkIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "primary.main" }}
          >
            Append Teacher
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />

        {/* Personal Info  */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
        >
          <ContactMailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Personal Information
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="first-name"
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="last-name"
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              variant="outlined"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Professional Details  */}
        <Typography
          variant="h6"
          sx={{ mb: 2, fontWeight: 500, color: "primary.main" }}
        >
          <WorkIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Professional Details
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="faculty-label">Faculty</InputLabel>
              <Select
                labelId="faculty-label"
                id="faculty-select"
                value={khoaID}
                label="Faculty *"
                onChange={(e) => setKhoaID(e.target.value)}
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
            <FormControl fullWidth required>
              <InputLabel id="designation-label">Designation</InputLabel>
              <Select
                labelId="designation-label"
                id="designation-select"
                value={designation}
                label="Designation *"
                onChange={(e) => setDesignation(e.target.value)}
              >
                {designations.map((desOption) => (
                  <MenuItem key={desOption} value={desOption}>
                    {desOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Submit */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearForm}
            startIcon={<ClearIcon />}
          >
            Clear Form
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            disabled={isLoading || !firstName.trim() || !lastName.trim() || !khoaID || !designation}
          >
            {isLoading ? "Saving..." : "Append Teacher"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={6000}
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