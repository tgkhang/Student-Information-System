import React from "react";
import { Box, Typography, Chip, Card, CardContent, Grid } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";

import {
  Grid2,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  //Table,TableBody,TableCell, TableContainer, TableRow, TableHead, Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
// import { formatDate } from "../utils/dateUtils"; // Assuming you have a date utility function

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  } catch (e) {
    return dateString;
  }
};

// CourseCard component: display individual course information
const CourseCard = ({ course, onClick  }) => {
  console.log("CourseCard course:", course);
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Course ID and Name */}
          <Box>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold", fontSize: "1rem" }}
            >
              {course?.id} - {course?.name.toUpperCase()}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Instructor: {course?.instructor?.HoTen}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {course?.MoTa}
          </Typography>

          {/*Course details*/}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            <Chip
              icon={<AccessTimeIcon fontSize="small" />}
              label={`${formatDate(course.startDate)} - ${formatDate(
                course.endDate
              )}`}
              size="small"
              sx={{ bgcolor: "#f0f7ff", color: "#0057b7" }}
            />
             <Chip 
              icon={<PersonIcon fontSize="small" />} 
              label={course?.TroGiangID?.HoTen || "No Assistant"} 
              size="small"
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <Chip 
              icon={<PeopleIcon fontSize="small" />} 
              label={`${course.registeredStudents}/${course.maxStudents} Students`} 
              size="small"
              sx={{ bgcolor: '#f5f5f5' }}
            />
           <Chip
              icon={<ClassIcon fontSize="small" />}
              label={`${course.credits} Credits`}
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            /> 
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// CourseList component to display all courses
const CourseList = ({ courses, searchTerm, year }) => {
  // Filter courses based on search term and filters
  const filteredCourses = courses.filter((course) => {
    // Filter by search term (course name or ID)
    const matchesSearch = searchTerm
      ? course?.TenKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course?.MaKhoaHoc.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesYear = year ? course.semester.includes(year.toString()) : true;

    return matchesSearch  && matchesYear;
  });

  return (
    <Box>
      {filteredCourses.length > 0 ? (
        <Grid container spacing={2}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} key={course._id}>
              <CourseCard course={course} onClick={() => { window.location.href = `/teacher/course/${course?.MaKhoaHoc}` }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No courses found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

function CoursesListAndSearch({ courses }) {
  //component for a course list + filter semester and search bar
  const [semester, setSemester] = React.useState("");
  const [year, setYear] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Grid2
      container
      spacing={4}
      sx={{
        width: "100%",
        flexGrow: 1,
        maxWidth: "100%",
      }}
    >
      {/* Course Content Card */}
      <Grid2 item xs={12} sx={{ height: "100%", width: "100%" }}>
        <Card elevation={0} sx={{ borderRadius: 2, height: "100%" }}>
          <CardContent>
            {/* Filter and Search Row */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 3,
              }}
            >
              {/* Filter controls - both on the right */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    color: "primary.main",
                  }}
                >
                  Courses
                </Typography>
                {/* Both filters on the right */}
                <Box sx={{ display: "flex", gap: 1 }}>

                  <CustomSelect
                    items={[2020, 2021, 2022, 2023, 2024, 2025]}
                    label="Year"
                    id="year-select"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </Box>
              </Box>

              {/* Full width search bar */}
              <Box
                sx={{
                  width: "100%",
                  mt: 1,
                }}
              >
                <TextField
                  placeholder="Search courses..."
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{
                    width: "100%",
                  }}
                  InputProps={{
                    endAdornment: <SearchIcon />,
                  }}
                />
              </Box>
            </Box>
            {/* Course list */}
            <CourseList
              courses={courses || []}
              searchTerm={searchTerm}
              year={year}
            />
          </CardContent>
        </Card>
      </Grid2>
    </Grid2>
  );
}

// Custom select component
function CustomSelect({
  items = [],
  label = "Select",
  value,
  onChange,
  id = "custom-select",
  width = 120,
  required = false,
}) {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box sx={{ minWidth: width }}>
      <FormControl
        sx={{ m: 1, minWidth: 120 }}
        size="small"
        required={required}
      >
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          value={value || ""}
          label={label}
          autoWidth
          onChange={handleChange}
        >
          {items.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export {formatDate, CourseCard, CoursesListAndSearch, CourseList, CustomSelect };
