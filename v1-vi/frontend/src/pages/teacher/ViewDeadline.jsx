import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { getDeadline } from "../../utils/api";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export default function ViewDeadline() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const id = useParams().id;
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchDeadlineData = async () => {
      try {
        setLoading(true);
        const response = await getDeadline(id);
        if (response.status === 200) {
          const data = response.data;
          console.log("Deadline data:", data);
          setData(data);
          setDeadline(dayjs(data?.NgayHetHan));
          setSubmissions(data?.Submissions || []);
        } else {
          enqueueSnackbar("Failed to fetch deadline data.", { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar("Error fetching deadline data.", { variant: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchDeadlineData();
  }, [id, enqueueSnackbar]);

  const handleDownload = (submission) => {
    if (!submission?.TaiLieu?.LinkTaiLieu) return;
    
    const a = document.createElement('a');
    a.href = submission.TaiLieu.LinkTaiLieu;
    a.target = "_blank";
    a.click();
    
    enqueueSnackbar("File downloading...", { variant: "info" });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <ArticleIcon />;
    
    const extension = fileName.split('.').pop().toLowerCase();
    
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

  const getSubmissionStatus = (submission) => {
    if (!submission || !deadline) return null;
    
    const submittedAt = dayjs(submission.NgayTao || submission.TaiLieu?.NgayTao);
    const isOnTime = submittedAt.isBefore(deadline);
    
    const diff = deadline.diff(submittedAt);
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
    
    return {
      label: `${label} ${isOnTime ? "early" : "late"}`,
      color: isOnTime ? "success" : "error",
      icon: isOnTime ? <CheckCircleIcon fontSize="small" /> : <AccessTimeIcon fontSize="small" />
    };
  };


  return (
    <Page title={`View Deadline - ${data?.MoTa}`}>
      <Box maxWidth={1200} mx="auto" mt="64px" p={2}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mt: 1
          }}
        >
          Submissions for: {data?.MoTa}
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
            <strong>Deadline:</strong> {deadline?.format("DD/MM/YYYY HH:mm:ss")}
          </Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Total Submissions:</strong> {submissions.length}
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          {submissions.length > 0 ? (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Student ID</strong></TableCell>
                    <TableCell><strong>File</strong></TableCell>
                    <TableCell><strong>Submitted At</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Action</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission) => {
                    const status = getSubmissionStatus(submission);
                    return (
                      <TableRow 
                        key={submission._id}
                        hover
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: 'action.hover',
                            cursor: 'pointer' 
                          }
                        }}
                        onClick={() => handleDownload(submission)}
                      >
                        <TableCell>{submission.SinhVienID}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            {getFileIcon(submission.TaiLieu?.TenTaiLieu)}
                            <Typography>{submission.TaiLieu?.TenTaiLieu}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {dayjs(submission.NgayTao || submission.TaiLieu?.NgayTao).format("DD/MM/YYYY HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          {status && (
                            <Chip 
                              icon={status.icon}
                              label={status.label} 
                              color={status.color} 
                              size="small" 
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Download Submission">
                            <IconButton 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(submission);
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={5}
            >
              <CancelIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No submissions yet
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Page>
  );
}