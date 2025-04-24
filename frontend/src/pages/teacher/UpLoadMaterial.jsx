import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import {
  Description as FileIcon,
  CloudUpload as UploadIcon,
  Close as CloseIcon,
  Title as TitleIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import { uploadFile } from "../../utils/api";

export default function UploadMaterials() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const { id } = useParams();
  const [titleError, setTitleError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const removeFile = () => {
    setFile(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
  });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setTitleError(false);
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError(true);
      enqueueSnackbar("Please enter a title for your material", { 
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
      isValid = false;
    }

    if (!file) {
      enqueueSnackbar("Please select a file to upload", { 
        variant: "error",
        anchorOrigin: { vertical: "top", horizontal: "right" }
      });
      isValid = false;
    }

    return isValid;
  };

  const handleUpload = () => {
    if (!validateForm()) {
      return;
    }

    console.log(title);
    console.log(file);
    console.log(id);
    const formData = new FormData();
  formData.append("moTa", title);
  formData.append("file", file);
  formData.append("khoaHocId", id);
  const response = uploadFile(formData);
  if (response.status < 300) {
    enqueueSnackbar("File uploaded successfully!", {
      variant: "success",
    });
    window.history.back();
  }
  else {
    enqueueSnackbar("File upload failed!", {
      variant: "error",
    });
  }
  };

  // Function to get file type icon color based on extension
  const getFileColor = (filename) => {
    if (!filename) return "#9E9E9E";
    const extension = filename.split('.').pop().toLowerCase();
    const colorMap = {
      pdf: "#F40F02",
      doc: "#2B579A",
      docx: "#2B579A",
      xls: "#217346",
      xlsx: "#217346",
      ppt: "#D24726",
      pptx: "#D24726",
      jpg: "#0063DC",
      jpeg: "#0063DC",
      png: "#4CAF50",
      txt: "#607D8B",
    };
    return colorMap[extension] || "#9E9E9E";
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <Page title="Upload Teaching Material">
      <Box maxWidth={800} mx="auto" mt="64px" sx={{p: 2}}>
        <Typography
          variant="h4"
          fontWeight={600}
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          Upload Teaching Material
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box mb={3}>
            <TextField
              fullWidth
              label="Title"
              required
              variant="outlined"
              value={title}
              onChange={handleTitleChange}
              error={titleError}
              helperText={titleError ? "Title is required" : ""}
              placeholder="Enter the title for your teaching material"
              InputProps={{
                startAdornment: (
                  <TitleIcon color="action" sx={{ mr: 1 }} />
                ),
              }}
            />
          </Box>

          <Typography variant="body1" mb={2}>
            Drag and drop a file here, or click to select a file.
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              border: "2px dashed",
              borderColor: isDragActive ? "primary.main" : "grey.400",
              borderRadius: 2,
              p: 5,
              textAlign: "center",
              cursor: "pointer",
              bgcolor: isDragActive ? "rgba(25, 118, 210, 0.08)" : "transparent",
              mb: 3,
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "rgba(25, 118, 210, 0.04)",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <input {...getInputProps()} />
            <UploadIcon
              sx={{
                fontSize: 48,
                color: isDragActive ? "primary.main" : "grey.600",
                mb: 2,
              }}
            />
            <Typography variant="h6" color={isDragActive ? "primary.main" : "text.secondary"}>
              {isDragActive ? "Drop file here..." : "Click or drag file to upload"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Only one file is allowed
            </Typography>
          </Box>

          {file && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={1}
                px={1}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Selected File
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <ListItem
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: "grey.50",
                  "&:hover": {
                    bgcolor: "grey.100",
                  },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={removeFile}
                    size="small"
                    sx={{ color: "error.main" }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FileIcon sx={{ color: getFileColor(file.name) }} />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={formatFileSize(file.size)}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.7rem" }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(file.lastModified).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
            </Paper>
          )}

          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined" onClick={() => window.history.back()}>
              Go Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpload}
              startIcon={<UploadIcon />}
            >
              Upload
            </Button>
          </Box>
        </Paper>
      </Box>
    </Page>
  );
}