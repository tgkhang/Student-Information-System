"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Divider,
  styled,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import GradeIcon from "@mui/icons-material/Grade";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import { useLocation, useNavigate } from "react-router-dom";
import Page from "../../components/Page";
import { getStudentInfo, getListScoreById } from "../../utils/api";
import useAuth from "../../hooks/useAuth";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// Sample data for the summary cards
const summaryData = {
  totalCredits: 120,
  completedCredits: 85,
  gpa: 3.75,
  totalCourses: 40,
  completedCourses: 28,
  currentSemester: "S1-2024-2025",
};

export default function Dashboard() {
  const [student, setStudent] = useState({});
  const [score, setScore] = useState({});
  const [gpa, setGpa] = useState(0);
  const location = useLocation();
  const { user } = useAuth();

  // Get tab from URL query parameter
  const getTabFromUrl = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    return tabParam ? Number.parseInt(tabParam, 10) : 0;
  };

  // ten mon , credit, giua ki, cuoi ki, diem trung binh
  const subjectScoresData = useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await getStudentInfo(user.username);
        // Handle the response data as needed
        //console.log("Student Info:", response.data);
        setStudent(response.data);
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };
    fetchStudentInfo();
  }, [user]);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const tmp = await getListScoreById(user.username);
        //console.log(user.username)
        console.log(tmp.data);
        setScore(tmp.data);
        // console.log(score.data);
      } catch (error) {
        console.error("Error fetching student info:", error);
      }
    };
    fetchScore();
  }, []);

  useEffect(() => {
    console.log("Updated score state:", score);
    calculateGPA();
  }, [score]);

  const calculateGPA = () => {
    if (!Array.isArray(score) || score.length === 0) {
      setGpa(0);
      return;
    }

    let totalGPA = 0;
    score.forEach((element) => {
      if (typeof element.DiemTrungBinh === "number") {
        totalGPA += element.DiemTrungBinh;
      } else {
        console.warn("Invalid score element:", element);
      }
    });

    const averageGPA = totalGPA / score.length;

    console.log("Calculated GPA:", averageGPA);
    setGpa(averageGPA);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    // No need to call navigate()
  };

  // Update tab when URL changes
  useEffect(() => {
    setValue(getTabFromUrl());
  }, [location.search]);

  return (
    <Page title="My Dashboard">
      <Box sx={{ display: "flex", p: 1 }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 4,
            }}
          >
            Student Dashboard
          </Typography>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <GradeIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      GPA Summary
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {gpa}
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total Credits: {summaryData.totalCredits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {summaryData.completedCredits}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Course Progress
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {Math.round(
                      (summaryData.completedCourses /
                        summaryData.totalCourses) *
                        100
                    )}
                    %
                  </Typography>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Total Courses: {summaryData.totalCourses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed: {summaryData.completedCourses}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Current Semester
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    S1
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Academic Year: 2024-2025
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="dashboard tabs"
                  sx={{
                    "& .MuiTab-root": {
                      fontWeight: 500,
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "primary.main",
                      height: 3,
                    },
                    "& .Mui-selected": {
                      color: "primary.main",
                      fontWeight: "bold",
                    },
                  }}
                >
                  <Tab label="Student Info" {...a11yProps(0)} />
                  <Tab label="Subject Results" {...a11yProps(1)} />
                </Tabs>
              </Box>

              {/* Student Info Tab */}
              <TabPanel value={value} index={0}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={12}>
                    <Card
                      elevation={0}
                      sx={{ borderRadius: 2, height: "100%" }}
                    >
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            mb: 3,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 120,
                              height: 120,
                              mb: 2,
                              bgcolor: "primary.main",
                              fontSize: "2.5rem",
                            }}
                          >
                            {student.Hoten}
                          </Avatar>
                          <Typography variant="h3" sx={{ fontWeight: "700" }}>
                            {student.HoTen}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {student.Khoa}
                          </Typography>
                          <Chip
                            label={student.TrangThai}
                            color="success"
                            sx={{ mt: 1, fontWeight: "medium" }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card
                      elevation={0}
                      sx={{ borderRadius: 2, height: "100%" }}
                    >
                      <CardContent>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "primary.main",
                          }}
                        >
                          Personal Information
                        </Typography>

                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <FingerprintIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Student ID"
                              secondary={student.mssv}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                                color: "secondary.main",
                              }}
                              secondaryTypographyProps={{
                                variant: "body1",
                                fontWeight: "medium",
                              }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <EmailIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Email"
                              secondary={user.email}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                                color: "secondary.main",
                              }}
                              secondaryTypographyProps={{
                                variant: "body1",
                                fontWeight: "medium",
                              }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <PhoneIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Phone"
                              secondary={student.phone}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                                color: "secondary.main",
                              }}
                              secondaryTypographyProps={{
                                variant: "body1",
                                fontWeight: "medium",
                              }}
                            />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CalendarTodayIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary="Date of Birth"
                              secondary={formatDate(student.NgaySinh)}
                              primaryTypographyProps={{
                                variant: "body2",
                                fontWeight: 500,
                                color: "secondary.main",
                              }}
                              secondaryTypographyProps={{
                                variant: "body1",
                                fontWeight: "medium",
                              }}
                            />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Academic Info Card */}
                  <Grid item xs={12} md={6}>
                    <Card elevation={0} sx={{ borderRadius: 2, mb: 3 }}>
                      <CardContent>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: "bold",
                            mb: 2,
                            color: "primary.main",
                          }}
                        >
                          Academic Information
                        </Typography>

                        <Grid container spacing={3}>
                          <Grid item xs={12} md={6}>
                            <List dense>
                              <ListItem>
                                <ListItemIcon>
                                  <PersonIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Gender"
                                  secondary={student.GioiTinh}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 500,
                                    color: "secondary.main",
                                  }}
                                  secondaryTypographyProps={{
                                    variant: "body1",
                                    fontWeight: "medium",
                                  }}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <HomeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Address"
                                  secondary={student.DiaChi}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 500,
                                    color: "secondary.main",
                                  }}
                                  secondaryTypographyProps={{
                                    variant: "body1",
                                    fontWeight: "medium",
                                  }}
                                />
                              </ListItem>
                              <ListItem>
                                <ListItemIcon>
                                  <GradeIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                  primary="Current GPA"
                                  secondary={summaryData.gpa}
                                  primaryTypographyProps={{
                                    variant: "body2",
                                    fontWeight: 500,
                                    color: "secondary.main",
                                  }}
                                  secondaryTypographyProps={{
                                    variant: "body1",
                                    fontWeight: "medium",
                                  }}
                                />
                              </ListItem>
                            </List>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </TabPanel>

              <TabPanel value={value} index={1}>
                {score && Array.isArray(score)
                  ? score.map((item, index) => (
                      <SubjectScore key={index} item={item} />
                    ))
                  : null}
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Page>
  );
}

// Fixed SubjectScore component
const SubjectScore = (props) => {
  // Make sure item is being accessed correctly
  const item = props.item;

  return (
    <Box mb={3}>
      <Typography
        variant="h6"
        color="primary"
        sx={{ fontWeight: "bold", fontSize: "1rem" }}
      >
        {item?.KhoaHocID?.MaKhoaHoc} -{" "}
        {item?.KhoaHocID?.TenKhoaHoc?.toUpperCase()}
      </Typography>
      <Table>
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Loại điểm</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Hệ số</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Điểm</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {item?.DiemThanhPhan && Array.isArray(item.DiemThanhPhan)
            ? item.DiemThanhPhan.map((component, index) => (
                <TableRow key={index}>
                  <TableCell>{component.LoaiDiem}</TableCell>
                  <TableCell>{(component.HeSo * 100).toFixed(0)}%</TableCell>
                  <TableCell>{component.Diem.toFixed(2)}</TableCell>
                </TableRow>
              ))
            : null}
          {item?.DiemTrungBinh && (
            <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Điểm trung bình</TableCell>
              <TableCell>100%</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                {item.DiemTrungBinh.toFixed(2)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  );
};
