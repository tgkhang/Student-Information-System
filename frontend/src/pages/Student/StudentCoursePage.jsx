"use client";
import {useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import Page from "../../components/Page";
import {
  Box,
  Typography,
  //Table,TableBody,TableCell, TableContainer, TableRow, TableHead, Paper,
} from "@mui/material";
import {CoursesListAndSearch} from "../../components/CourseList";
import { getListCoursesByStudent, getStudentInfo } from "../../utils/api";


export default function StudentCoursePage() {  
  const [classesData, setClassesData] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await getStudentInfo(user.username);
        const courses = await getListCoursesByStudent(response.data._id);
        setClassesData(courses.data.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }
  , []);
    return (
      <Page title="My Courses">
        <Box sx={{ display: "flex", p: 1, mt: "64px" }}>
          <Box
            component="main"
            sx={{
              p: 1,
              transition: (theme) =>
                theme.transitions.create(["margin", "width"], {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.enteringScreen,
                }),
              marginLeft: 0,
              width: "100%",
              // marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
              // width: isDrawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            }}
          >
            <CoursesListAndSearch courses={classesData}/>
          </Box>
        </Box>
      </Page>
    );
  }