"use client";
import Page from "../../components/Page";
import {
  Box,
  Typography,
  //Table,TableBody,TableCell, TableContainer, TableRow, TableHead, Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {CourseList,CustomSelect,CoursesListAndSearch} from "../../components/CourseList";
import classesData from "../mockdata/courseData";
import { getListCourses } from "../../utils/api";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getListCourses(user.username);
        setCourses(response.data);
        console.log("Courses data:", response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <Page title="StudentClassRegistrationPage">
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{
            p: 3,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            marginLeft: 0,
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Courses
          </Typography>

          <CoursesListAndSearch courses={classesData} />
        </Box>
      </Box>
    </Page>
  );
}