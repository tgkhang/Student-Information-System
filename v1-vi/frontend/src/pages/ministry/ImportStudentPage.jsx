"use client";
import React, { useState, useRef } from "react";
import Page from "../../components/Page";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { importStudentApi } from "../../utils/api";

export default function ImportStudentPage() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const fileInputRef = useRef(null);

  
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Check if file is CSV/Excel
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/csv",
      ];

      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        showMessage("Please select a valid Excel or CSV file", "error");
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showMessage("Please select a file first", "error");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object correctly
      const formData = new FormData();
      // Make sure to use 'file' as the field name since that's what the backend expects
      formData.append("file", file);


      const response = await importStudentApi(formData);
      showMessage("Students imported successfully!", "success");
      setFile(null);

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error importing students:", error);
      const errorMessage =
        error.response?.data?.message ||
        (typeof error.message === "string"
          ? error.message
          : "Error importing students");
      showMessage(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadTemplate = () => {
    // Use the correct path to access public files
    const templateUrl = "/Book1.xlsx";
    try {
      const link = document.createElement("a");
      link.href = templateUrl;
      link.download = "studentTemplate.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading template:", error);
      showMessage("Error downloading template file", "error");
    }
  };

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  return (
    <Page title="Import Student">
      <Box
        sx={{
          mt: "64px",
          py: 2
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
            <PersonAddIcon sx={{ mr: 2, color: "primary.main", fontSize: 32 }} />
            <Typography
              variant="h4"
              sx={{
                color: "primary.main"
              }}
            >
              Import Student List
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Step 1: Download the CSV template
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={downloadTemplate}
                sx={{ mb: 3 }}
              >
                Download Template
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Step 2: Prepare your data and upload the file
              </Typography>
              <Box sx={{ mb: 2 }}>
                <input
                  ref={fileInputRef}
                  accept=".csv,.xlsx,.xls"
                  id="contained-button-file"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="contained-button-file">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Select File
                  </Button>
                </label>
                {file && (
                  <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      Selected file: {file.name}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={handleClearFile}
                    >
                      Clear
                    </Button>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Step 3: Import students
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <PersonAddIcon />
                  )
                }
                onClick={handleUpload}
                disabled={!file || isLoading}
              >
                {isLoading ? "Importing..." : "Import Students"}
              </Button>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="h5"
              color="primary.main"
              paddingBottom={2}
            >
              Notes:
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              component="ul"
              sx={{ pl: 2 }}
            >
              <li>The file must be in CSV or Excel format (.csv, .xlsx, .xls)</li>
              <li>Each row should contain information for one student</li>
              <li>Student ID (MSSV) is required and must be unique</li>
              <li>Make sure to follow the template format</li>
              <li>Maximum file size: 10MB</li>
            </Typography>
          </Box>
        </Paper>
      </Box>

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
