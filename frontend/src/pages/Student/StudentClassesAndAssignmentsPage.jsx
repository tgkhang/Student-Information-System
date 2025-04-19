"use client";

import {useEffect, useState} from "react";
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
  styled,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Page from "../../components/Page";


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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

// More realistic data for registered classes
const registeredClassesData = [
  {
    id: "CS302",
    subjectName: "Advanced Algorithms",
    credit: 3,
    class: "CS-A1",
    teacher: "Dr. Smith",
    ta: "John Davis",
    time: "Mon, Wed 10:00-11:30",
    note: "Required",
    status: "active",
    progress: 85,
  },
  {
    id: "MATH401",
    subjectName: "Linear Algebra",
    credit: 4,
    class: "M-B2",
    teacher: "Prof. Johnson",
    ta: "Sarah Wilson",
    time: "Tue, Thu 13:00-14:30",
    note: "Elective",
    status: "active",
    progress: 72,
  },
  {
    id: "ENG205",
    subjectName: "Technical Writing",
    credit: 2,
    class: "E-C3",
    teacher: "Dr. Williams",
    ta: "Michael Brown",
    time: "Fri 9:00-11:00",
    note: "Required",
    status: "active",
    progress: 60,
  },
  {
    id: "CS405",
    subjectName: "Machine Learning",
    credit: 3,
    class: "CS-D1",
    teacher: "Dr. Anderson",
    ta: "Emily White",
    time: "Mon, Wed 14:00-15:30",
    note: "Elective",
    status: "completed",
    progress: 100,
  },
  {
    id: "PHYS201",
    subjectName: "Physics for CS",
    credit: 3,
    class: "P-A2",
    teacher: "Prof. Roberts",
    ta: "David Miller",
    time: "Tue, Thu 10:00-11:30",
    note: "Required",
    status: "completed",
    progress: 100,
  },
];

export default function StudentClassesAndAssignmentsPage() {

  const [semester, setSemester] = useState("2");
  const [year, setYear] = useState("2024");
  const [searchTerm, setSearchTerm] = useState("");
  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter classes based on search term
  const filteredClasses = registeredClassesData.filter(
    (classItem) =>
      classItem.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.teacher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "pending":
        return "warning";
      case "submitted":
        return "primary";
      case "graded":
        return "success";
      default:
        return "default";
    }
  };

  // Count pending assignments
  const pendingAssignmentsCount = 0

  return (
    <Page title="My Schedule">
      <Box sx={{ display: "flex", p: 1 }}>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            marginLeft: 0,
            width: "100%",
            backgroundColor: "#f5f5f5",
            minHeight: "calc(100vh - 64px)",
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
            Schedule
          </Typography>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Current Semester
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    S{semester}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Academic Year: {year}-{Number.parseInt(year) + 1}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <LibraryBooksIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Enrolled Classes
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {
                      registeredClassesData.filter((c) => c.status === "active")
                        .length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Credits:{" "}
                    {registeredClassesData
                      .filter((c) => c.status === "active")
                      .reduce((sum, item) => sum + item.credit, 0)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary">
                      Pending Assignments
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: "bold", mb: 1 }}>
                    {pendingAssignmentsCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next Due:{" "}
                    {"None"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={0}
                  aria-label="classes tabs"
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
                  <Tab label="My Classes" {...a11yProps(0)} />
                </Tabs>
              </Box>

              {/* My Classes Tab */}
              <TabPanel value={0} index={0}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="year-select-label">
                        Academic Year
                      </InputLabel>
                      <Select
                        labelId="year-select-label"
                        id="year-select"
                        value={year}
                        label="Academic Year"
                        onChange={handleYearChange}
                      >
                        <MenuItem value="2022">2022-2023</MenuItem>
                        <MenuItem value="2023">2023-2024</MenuItem>
                        <MenuItem value="2024">2024-2025</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="semester-select-label">
                        Semester
                      </InputLabel>
                      <Select
                        labelId="semester-select-label"
                        id="semester-select"
                        value={semester}
                        label="Semester"
                        onChange={handleSemesterChange}
                      >
                        <MenuItem value="1">Semester 1</MenuItem>
                        <MenuItem value="2">Semester 2</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      placeholder="Search classes..."
                      size="small"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      sx={{ minWidth: "400px" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    size="small"
                  >
                    Export Schedule
                  </Button>
                </Box>

                <TableContainer
                  component={Paper}
                  elevation={0}
                  sx={{ borderRadius: 2 }}
                >
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Subject Name</TableCell>
                        <TableCell align="center">Credits</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Teacher</TableCell>
                        <TableCell>Schedule</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Progress</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredClasses.map((row) => (
                        <StyledTableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {row.subjectName}
                          </TableCell>
                          <TableCell align="center">{row.credit}</TableCell>
                          <TableCell>{row.class}</TableCell>
                          <TableCell>{row.teacher}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <ScheduleIcon
                                fontSize="small"
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
                              {row.time}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                row.status === "active" ? "Active" : "Completed"
                              }
                              color={getStatusColor(row.status)}
                              size="small"
                              sx={{ fontWeight: "medium" }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ width: "100%", mr: 1 }}>
                                <Box
                                  sx={{
                                    width: "100%",
                                    height: 8,
                                    backgroundColor: "#e0e0e0",
                                    borderRadius: 4,
                                    overflow: "hidden",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: `${row.progress}%`,
                                      height: "100%",
                                      backgroundColor:
                                        row.progress === 100
                                          ? "success.main"
                                          : "primary.main",
                                      borderRadius: 4,
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {row.progress}%
                              </Typography>
                            </Box>
                          </TableCell>
                        </StyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Page>
  );
}