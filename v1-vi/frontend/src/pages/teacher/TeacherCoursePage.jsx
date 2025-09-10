"use client";
import Page from "../../components/Page";
import {
  Box,
  Typography,
  //Table,TableBody,TableCell, TableContainer, TableRow, TableHead, Paper,
} from "@mui/material";
import {CoursesListAndSearch} from "../../components/CourseList";
import { getListCourses, getTeacherInfo } from "../../utils/api";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";


export default function CoursePage() {
  const [courses, setCourses] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getTeacherInfo(user.username);
        const response = await getListCourses(res.data._id);
        setCourses(response.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);
  return (
    <Page title="My Courses">
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

          <CoursesListAndSearch courses={courses} isTeacher/>
        </Box>
      </Box>
    </Page>
  );
}