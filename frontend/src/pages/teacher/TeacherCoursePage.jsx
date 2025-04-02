"use client";

import * as React from "react";
import Page from "../../components/Page";
import TeacherNavigationDrawer from "./TeacherNavigationDrawer";
import {
  Box,
  Grid2,
  Typography,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  TextField,
  Card,
  CardContent,
  //Table,TableBody,TableCell, TableContainer, TableRow, TableHead, Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CourseList from "../../components/CourseList";
import classesData from "./mockdata/classData";
//import PropTypes from "prop-types";

const drawerWidth = 10;

// Add PropTypes validation
// CustomSelect.propTypes = {
//   items: PropTypes.array,
//   label: PropTypes.string,
//   value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
//   onChange: PropTypes.func,
//   id: PropTypes.string,
//   width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
//   required: PropTypes.bool,
// };

// Custom select component
export function CustomSelect({
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

export default function CoursePage() {
  const [isDrawerOpen, setDrawerOpen] = React.useState(true);
  const [semester, setSemester] = React.useState("");
  const [year, setYear] = React.useState("");
  const [searchTerm, setSearchTerm] = React.useState("");

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Page title="StudentClassRegistrationPage">
      <Box sx={{ display: "flex" }}>

        <Box
          component="main"
          sx={{
            p: 3,
            mt: 8,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            backgroundColor: "#f5f5f5",
            marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
            width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
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
            Courses
          </Typography>

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
                        justifyContent: "flex-end",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      {/* Both filters on the right */}
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <CustomSelect
                          items={["Semester 1", "Semester 2", "Semester 3"]}
                          label="Semester"
                          id="semester-select"
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                        />

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
                    courses={classesData}
                    searchTerm={searchTerm}
                    semester={semester}
                    year={year}
                  />
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Page>
  );
}
