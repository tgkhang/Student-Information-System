import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Link,
  IconButton
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { getDeadline } from "../../utils/api";
import useAuth from "../../hooks/useAuth";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const FILE_SIZE_LIMIT_MB = 20;

export default function StudentSubmission() {
  const [file, setFile] = useState(null);
  const [submit, setSubmission] = useState(null);
  const [submittedAt, setSubmittedAt] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [deadline, setDeadline] = useState(dayjs("2025-10-01T12:00:00Z"));
  const [data, setData] = useState(null);
  const id = useParams().id;
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
      const getDeadlineData = async () => {
        try {
          const response = await getDeadline(id);
          if (response.status === 200) {
            const data = response.data;
            setData(data);
            setDeadline(dayjs(data?.NgayHetHan));
            const submission = data?.Submissions?.find(
              (element) => element.TaiLieu?.NguoiDang === user.username
            );
            if (submission) {
              setSubmission(submission);
              setFile(submission?.TaiLieu?.TenTaiLieu);
              setSubmittedAt(dayjs(submission.NgayTao));
            }            
          } else {
            enqueueSnackbar("Failed to fetch deadline data.", { variant: "error" });
          }
        } catch (error) {
          enqueueSnackbar("Error fetching deadline data.", { variant: "error" });
        }
      }
      getDeadlineData();
  }, [id])
  // Giả lập deadline từ giáo viên
  const now = dayjs();
  const isOverdue = now.isAfter(deadline);
  const hasSubmitted = !!submittedAt;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
      enqueueSnackbar(`File exceeded the limit of ${FILE_SIZE_LIMIT_MB}MB.`, { variant: "error" });
      return;
    }
    setFile(selectedFile);
  };

  const handleSubmit = () => {
    setSubmittedAt(dayjs());
    enqueueSnackbar("Submission successful!", { variant: "success" });
    setConfirmSubmit(false);
  };
  
  const handleRemove = () => {
    setFile(null);
    setSubmittedAt(null);
    enqueueSnackbar("Submission deleted.", { variant: "info" });
    setConfirmRemove(false);
  };

  const handleDownload = () => {
    if (!file) return;
    if (typeof file === "string") {
      const a = document.createElement('a');
      a.href = submit?.TaiLieu?.LinkTaiLieu;
      a.target = "_blank"; 
      a.click();
      return;
    }
    
    // Tạo URL cho file để tải về
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    enqueueSnackbar("File downloading...", { variant: "info" });
  };

  const renderTimeInfo = () => {
    if (hasSubmitted) {
      const diff = deadline.diff(submittedAt); // milliseconds
      const isEarly = diff > 0;
      const absDiff = Math.abs(diff);
      const dur = dayjs.duration(absDiff);
  
      let label = "";
      if (dur.asSeconds() < 60) {
        label = `${Math.floor(dur.asSeconds())} seconds`;
      } else if (dur.asMinutes() < 60) {
        label = `${Math.floor(dur.asMinutes())} minutes`;
      } else if (dur.asHours() < 24) {
        label = `${Math.floor(dur.asHours())} hours`;
      } else if (dur.asDays() < 30) {
        label = `${Math.floor(dur.asDays())} days`;
      } else {
        label = `${Math.floor(dur.asMonths())} months`;
      }
  
      return (
        <Chip
          label={`Your submission is ${label} ${isEarly ? "early" : "late"}`}
          color={isEarly ? "success" : "error"}
          sx={{ mt: 1 }}
        />
      );
    }

    if (isOverdue) {
      const lateBy = dayjs.duration(now.diff(deadline)).humanize();
      return (
        <Typography color="error" fontWeight="bold" sx={{ mt: 1 }}>
          Submission is overdue by {lateBy}. The system no longer accepts files.
        </Typography>
      );
    }

    const remaining = dayjs.duration(deadline.diff(now));

    const formatTimeUnit = (value, unit) => {
      const rounded = Math.floor(value);
      return `${rounded} ${rounded === 1 ? unit : unit + "s"}`;
    };

    const remainingText =
      remaining.asDays() >= 1
        ? formatTimeUnit(remaining.asDays(), "day")
        : remaining.asHours() >= 1
        ? formatTimeUnit(remaining.asHours(), "hour")
        : remaining.asMinutes() >= 1
        ? formatTimeUnit(remaining.asMinutes(), "minute")
        : formatTimeUnit(remaining.asSeconds(), "second");

    return (
      <Typography color="primary" fontWeight="bold" sx={{ mt: 1 }}>
        Time Remaining: {remainingText}
      </Typography>
    );
  };

  const getFileIcon = () => {
    if (!file) return null;
    
    const extension = file?.name?.split('.').pop().toLowerCase();
    
    if (['pdf'].includes(extension)) {
      return <ArticleIcon sx={{ color: '#E44D26' }} />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <ArticleIcon sx={{ color: '#2A5699' }} />;
    } else if (['ppt', 'pptx'].includes(extension)) {
      return <ArticleIcon sx={{ color: '#D04423' }} />;
    } else if (['xls', 'xlsx'].includes(extension)) {
      return <ArticleIcon sx={{ color: '#217346' }} />;
    } else {
      return <ArticleIcon />;
    }
  };

  const renderFileUpload = () => {
    if (!hasSubmitted) {
      return (
        <Box
          sx={{
            border: "2px dashed",
            borderColor: file ? "success.main" : "grey.400",
            padding: 3,
            borderRadius: 2,
            textAlign: "center",
            backgroundColor: file ? "success.light" : "inherit",
            transition: "all 0.3s ease",
            position: "relative",
          }}
        >
          <input
            type="file"
            accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: isOverdue ? "not-allowed" : "pointer",
            }}
            onChange={handleFileChange}
            disabled={isOverdue}
          />
          
          {file ? (
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
              <UploadFileIcon color="success" />
              <Typography fontWeight="bold">
                Uploaded file: {file?.name} ({(file?.size / (1024 * 1024)).toFixed(2)} MB)
              </Typography>
              <IconButton 
                size="small" 
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Box>
              <UploadFileIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
              <Typography>
                Drag and drop or click to choose file
              </Typography>
              <Typography variant="body1" color="text.secondary">
                (Maximum file size: {FILE_SIZE_LIMIT_MB}MB)
              </Typography>
            </Box>
          )}
        </Box>
      );
    } else {
      // Hiển thị file đã nộp có thể click để tải về
      return (
        <Paper
          elevation={1}
          sx={{
            padding: 3,
            borderRadius: 2,
            backgroundColor: "success.light",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "success.main",
              "& .download-icon": {
                opacity: 1,
              }
            },
          }}
          onClick={handleDownload}
        >
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              {getFileIcon()}
              <Typography fontWeight="bold">
              {file?.name || file}
{!isNaN(file?.size) && file?.size !== undefined && (
  ` (${(file.size / (1024 * 1024)).toFixed(2)} MB)`
)}

              </Typography>
            </Stack>
            <Box className="download-icon" sx={{ 
              opacity: 0.6, 
              transition: "opacity 0.3s ease",
              display: "flex",
              alignItems: "center",
            }}>
              <Typography variant="body1" sx={{ mr: 1 }}>Click to download</Typography>
              <DownloadIcon />
            </Box>
          </Stack>
        </Paper>
      );
    }
  };

  return (
    <Page title="Submit Assignment">
      <Box maxWidth={800} mx="auto" mt="64px" p={2}>
        <Typography
          variant="h4" gutterBottom
          sx={{
            fontWeight: 700, color: "primary.main", mt: 1
          }}
        >
          Submission - {data?.MoTa}
        </Typography>

        <Paper 
          sx={{ 
            p: 2, 
            mb: 3, 
            backgroundColor: "primary.light", 
            fontWeight: "bold",
            fontSize: "1.1rem",
            borderRadius: 2 
          }}
        >
          <Typography>
            <strong>Deadline:</strong> {deadline.format("DD/MM/YYYY HH:mm:ss")}
          </Typography>
          {renderTimeInfo()}
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack spacing={3}>
            {renderFileUpload()}

            <Box display="flex" justifyContent="flex-end" gap={2}>
              {hasSubmitted ? (
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => setConfirmRemove(true)}
                  startIcon={<DeleteIcon />}
                >
                  Delete submission
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!file || isOverdue}
                  onClick={() => setConfirmSubmit(true)}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Dialog xác nhận nộp */}
      <ConfirmationDialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        onConfirm={handleSubmit}
        title="Confirm Submission"
        message={
          <>
            Are you sure you want to submit the file: <strong>{file?.name}</strong>?
            <br />
            After submitting, you can still delete and resubmit within the allowed time.
          </>
        }
      />

      {/* Dialog xác nhận xóa */}
      <ConfirmationDialog
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={handleRemove}
        title="Confirm Deletion"
        message="Are you sure you want to delete your current submission?"
      />
    </Page>
  );
}