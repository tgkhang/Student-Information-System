"use client"

import * as React from "react"
import Box from "@mui/material/Box"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"

import Header from '../components/Header';
import NavigationDrawer from '../components/NavigationDrawer';

import Chip from "@mui/material/Chip"
import Button from "@mui/material/Button"
import DownloadIcon from "@mui/icons-material/Download"
import FilterListIcon from "@mui/icons-material/FilterList"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import Grid from "@mui/material/Grid"
import GradeIcon from "@mui/icons-material/Grade"
import SchoolIcon from "@mui/icons-material/School"
import AssignmentIcon from "@mui/icons-material/Assignment"
import { styled } from "@mui/material/styles"

const drawerWidth = 240

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  }
}

// Sample data for the summary cards
const summaryData = {
  totalCredits: 120,
  completedCredits: 85,
  gpa: 3.75,
  totalCourses: 40,
  completedCourses: 28,
  currentSemester: "S1-2024-2025",
}

export default function StudentScoresPage() {
  const [value, setValue] = React.useState(0)
  const [semester, setSemester] = React.useState("")
  const [year, setYear] = React.useState("")
  const [isDrawerOpen, setDrawerOpen] = React.useState(true)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleSemesterChange = (event) => {
    setSemester(event.target.value)
  }

  const handleYearChange = (event) => {
    setYear(event.target.value)
  }

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen)
  }

  // Enhanced student scores data with more realistic values and status
  const studentScores = [
    {
      semester: "S1-2023-2024",
      subjectId: "CS101",
      name: "Introduction to Programming",
      credit: 3,
      class: "CS-A1",
      midterm: 85,
      practice: 90,
      bonus: 5,
      final: 88,
      overall: "A",
      note: "Passed",
      status: "passed",
    },
    {
      semester: "S1-2023-2024",
      subjectId: "MATH201",
      name: "Calculus I",
      credit: 4,
      class: "M-B2",
      midterm: 75,
      practice: 80,
      bonus: 3,
      final: 78,
      overall: "B+",
      note: "Passed",
      status: "passed",
    },
    {
      semester: "S1-2023-2024",
      subjectId: "ENG102",
      name: "Academic English",
      credit: 2,
      class: "E-C3",
      midterm: 65,
      practice: 70,
      bonus: 2,
      final: 68,
      overall: "C+",
      note: "Passed",
      status: "passed",
    },
    {
      semester: "S2-2023-2024",
      subjectId: "CS201",
      name: "Data Structures",
      credit: 3,
      class: "CS-A2",
      midterm: 55,
      practice: 60,
      bonus: 0,
      final: 58,
      overall: "D",
      note: "Retake Required",
      status: "failed",
    },
    {
      semester: "S2-2023-2024",
      subjectId: "PHYS101",
      name: "Physics for Computer Science",
      credit: 3,
      class: "P-A1",
      midterm: 92,
      practice: 95,
      bonus: 5,
      final: 94,
      overall: "A+",
      note: "Excellent",
      status: "passed",
    },
  ]

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "passed":
        return "success"
      case "failed":
        return "error"
      default:
        return "default"
    }
  }

  // Get grade color
  const getGradeColor = (grade) => {
    if (grade === "A+" || grade === "A") return "#4caf50"
    if (grade === "B+" || grade === "B") return "#2196f3"
    if (grade === "C+" || grade === "C") return "#ff9800"
    if (grade === "D+" || grade === "D") return "#f44336"
    return "#757575"
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Header toggleDrawer={toggleDrawer} />
      <NavigationDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

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
          marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
          width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
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
          Academic Results - Scores
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
                  {summaryData.gpa}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                  {Math.round((summaryData.completedCourses / summaryData.totalCourses) * 100)}%
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
                aria-label="score tabs"
                sx={{
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
                <Tab label="All Scores" {...a11yProps(0)} />
                <Tab label="Current Semester" {...a11yProps(1)} />
                <Tab label="Transcript" {...a11yProps(2)} />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
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
                    <InputLabel id="year-select-label">Academic Year</InputLabel>
                    <Select
                      labelId="year-select-label"
                      id="year-select"
                      value={year}
                      label="Academic Year"
                      onChange={handleYearChange}
                    >
                      <MenuItem value={2022}>2022-2023</MenuItem>
                      <MenuItem value={2023}>2023-2024</MenuItem>
                      <MenuItem value={2024}>2024-2025</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 120 }} size="small">
                    <InputLabel id="semester-select-label">Semester</InputLabel>
                    <Select
                      labelId="semester-select-label"
                      id="semester-select"
                      value={semester}
                      label="Semester"
                      onChange={handleSemesterChange}
                    >
                      <MenuItem value={1}>Semester 1</MenuItem>
                      <MenuItem value={2}>Semester 2</MenuItem>
                    </Select>
                  </FormControl>

                  <Button variant="outlined" startIcon={<FilterListIcon />} size="small">
                    More Filters
                  </Button>
                </Box>

                <Button variant="contained" startIcon={<DownloadIcon />} size="small">
                  Export PDF
                </Button>
              </Box>

              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="student scores table">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}>
                      <TableCell>Semester</TableCell>
                      <TableCell>Subject ID</TableCell>
                      <TableCell>Course Name</TableCell>
                      <TableCell align="center">Credits</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell align="center">Midterm</TableCell>
                      <TableCell align="center">Practice</TableCell>
                      <TableCell align="center">Bonus</TableCell>
                      <TableCell align="center">Final</TableCell>
                      <TableCell align="center">Grade</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentScores.map((row, index) => (
                      <StyledTableRow key={index}>
                        <TableCell>{row.semester}</TableCell>
                        <TableCell>{row.subjectId}</TableCell>
                        <TableCell sx={{ fontWeight: "medium" }}>{row.name}</TableCell>
                        <TableCell align="center">{row.credit}</TableCell>
                        <TableCell>{row.class}</TableCell>
                        <TableCell align="center">{row.midterm}</TableCell>
                        <TableCell align="center">{row.practice}</TableCell>
                        <TableCell align="center">{row.bonus}</TableCell>
                        <TableCell align="center">{row.final}</TableCell>
                        <TableCell align="center">
                          <Typography
                            sx={{
                              fontWeight: "bold",
                              color: getGradeColor(row.overall),
                            }}
                          >
                            {row.overall}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.status === "passed" ? "Passed" : "Failed"}
                            color={getStatusColor(row.status)}
                            size="small"
                            sx={{ fontWeight: "medium" }}
                          />
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Typography variant="body1">Current semester scores will be displayed here.</Typography>
            </TabPanel>

            <TabPanel value={value} index={2}>
              <Typography variant="body1">Your complete academic transcript will be displayed here.</Typography>
            </TabPanel>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}