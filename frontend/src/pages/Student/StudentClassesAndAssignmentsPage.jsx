"use client";

import { useEffect, useState} from "react";
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
import { getScheduleForStudent } from "../../utils/api";
import useAuth from "../../hooks/useAuth";

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

export default function StudentClassesAndAssignmentsPage() {
  const { user } = useAuth();
  const [semester, setSemester] = useState("2");
  const [year, setYear] = useState("2024");
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData ] = useState([]);
  const days = [
    'Sunday',    // 0 
    'Monday',    // 1
    'Tuesday',   // 2
    'Wednesday', // 3
    'Thursday',  // 4
    'Friday',    // 5
    'Saturday'   // 6
  ];
  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await getScheduleForStudent(user.username);
        setData(response.data);
      }
      catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };
    fetchSchedule();
  }, []);

  const nearestDeadline = (() => {
    const deadlines = data.flatMap(item =>
      item?.KhoaHocID?.Deadlines?.map(dl => new Date(dl.NgayHetHan)) || []
    );
  
    if (deadlines.length === 0) return null;
  
    const nearest = deadlines.reduce((min, date) =>
      date < min ? date : min
    );
  
    const dd = String(nearest.getDate()).padStart(2, '0');
    const mm = String(nearest.getMonth() + 1).padStart(2, '0');
    const yyyy = nearest.getFullYear();
  
    return `${dd}-${mm}-${yyyy}`;
  })();
  
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
                    {data.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Credits:{" "}
                    {data.reduce((sum, item) => sum + item?.KhoaHocID?.SoTinChi, 0)}
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
                    {data.reduce((sum, item) => sum + item?.KhoaHocID?.Deadlines?.length, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Next Due:{" "}
                    {nearestDeadline ? nearestDeadline : "No deadlines"}
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
                      <TableRow sx={{ backgroundColor: "primary.main" }}>
                        <TableCell sx={{color: "primary.lighter"}}>Course Code</TableCell>
                        <TableCell sx={{color: "primary.lighter"}}>Subject Name</TableCell>
                        <TableCell sx={{color: "primary.lighter"}} align="center">Credits</TableCell>
                        <TableCell sx={{color: "primary.lighter"}}>Teacher</TableCell>
                        <TableCell sx={{color: "primary.lighter"}}>Day</TableCell>
                        <TableCell sx={{color: "primary.lighter"}}>Schedule</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row) => (
                        <StyledTableRow key={row?._id}>
                          <TableCell>{row?.KhoaHocID?.MaKhoaHoc}</TableCell>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {row?.KhoaHocID?.TenKhoaHoc}
                          </TableCell>
                          <TableCell align="center">{row?.KhoaHocID?.SoTinChi}</TableCell>
                          <TableCell>{row?.GiangVienID?.HoTen}</TableCell>
                          <TableCell>{days[row?.NgayHoc % 7]}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <ScheduleIcon
                                fontSize="small"
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
                              {row?.ThoiGianBatDau} - {row?.ThoiGianKetThuc}
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