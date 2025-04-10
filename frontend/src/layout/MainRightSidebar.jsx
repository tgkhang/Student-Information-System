import { useTheme } from "@mui/material/styles";
import {
  Box, Drawer, IconButton, Tooltip, Typography, Card, CardContent, CardMedia, Grid, Chip
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

import { School, Code, DesignServices } from '@mui/icons-material';
import { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

import { CheckCircle, RadioButtonUnchecked, Error } from "@mui/icons-material";

const DRAWER_WIDTH = 250;


// --------------- CALENDAR SECTION ---------------

// Dummy assignment data
const assignmentdates = [
  { date: "2025-04-10" },
  { date: "2025-04-15" },
  { date: "2025-05-01" }
];

function CalendarMini() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, dateFormat);
      const dateString = format(day, "yyyy-MM-dd");

      const hasAssignment = assignmentdates.some((a) => a.date === dateString);
      const isToday = isSameDay(day, today);
      const isCurrentMonth = isSameMonth(day, currentMonth);

      days.push(
        <Box
          key={day}
          sx={{
            width: 30, height: 30, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "0.85rem",
            color: isToday ? "white" : isCurrentMonth ? "text.primary" : "text.disabled",
            bgcolor: isToday ? "primary.main" : "transparent",
            borderRadius: "50%", position: "relative"
          }}
        >
          {formattedDate}
          {hasAssignment && (
            <Box
              sx={{
                position: "absolute", bottom: 0, width: 6, height: 6,
                bgcolor: isToday ? "primary.lighter" : "primary.main", borderRadius: "50%"
              }}
            />
          )}
        </Box>
      );
      day = addDays(day, 1);
    }

    rows.push(
      <Box key={day} sx={{ display: "flex", justifyContent: "space-around" }}>
        {days}
      </Box>
    );
    days = [];
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", px: 1 }}>
        <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} size="small">
          <ChevronLeft fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1">{format(currentMonth, "MMMM yyyy")}</Typography>
        <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} size="small">
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around", width: "100%", fontSize: "0.75rem", color: "text.secondary" }}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <Box key={d} sx={{ width: 30, textAlign: "center" }}>{d}</Box>
        ))}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {rows}
      </Box>
    </Box>
  );
}


// ---------------- THIS SEMESTER ------------------

const enrolledCourses = [
  {
    name: "Web Development",
    icon: <Code sx={{ fontSize: 28, color: "white" }} />,
    schedule: "Fri, 13:30 - 17:30",
    hasPendingAssignments: false,
  },
  {
    name: "Data Structures",
    icon: <School sx={{ fontSize: 28, color: "white" }} />,
    schedule: "Mon, 09:00 - 12:00",
    hasPendingAssignments: true,
  },
  {
    name: "UI/UX Design",
    icon: <DesignServices sx={{ fontSize: 28, color: "white" }} />,
    schedule: "Wed, 10:00 - 12:00",
    hasPendingAssignments: false,
  },
];

function ThisSemesterSection() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, width: "100%" }}>
      {enrolledCourses.map((course, index) => (
        <Card
          key={index}
          sx={{
            width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
            px: 1, py: 1, gap: 1,
            borderRadius: 1, bgcolor: "white",
          }}
        >
          {/* Course image */}
          <Box sx={{ width: 40, height: 40, mr: 1,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      bgcolor: "primary.main", borderRadius: 1 }}>
            {course.icon}
          </Box>

          {/* Course text */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Box>
              <Typography variant="caption" fontWeight="bold" noWrap>
                {course.name}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary" noWrap>
                {course.schedule}
              </Typography>
            </Box>
          </Box>
        </Card>
      ))}
    </Box>
  );
}


// ---------------- MAIN RIGHT SIDEBAR ------------------

// Example data
const assignments = [
  {
    name: "Essay on UI Patterns",
    course: "Web Design",
    due: "Friday, Apr 12 • 17:30",
    status: "submitted",
  },
  {
    name: "Midterm Reflection",
    course: "Critical Thinking",
    due: "Saturday, Apr 13 • 23:59",
    status: "pending",
  },
  {
    name: "Final Report",
    course: "Software Engineering",
    due: "Wednesday, Apr 10 • 18:00",
    status: "late",
  },
];

function getStatusIcon(status) {
  switch (status) {
    case "submitted":
      return <CheckCircle sx={{ color: "success.main", fontSize: 24 }} />;
    case "pending":
      return <RadioButtonUnchecked sx={{ color: "text.disabled", fontSize: 24 }} />;
    case "late":
      return <Error sx={{ color: "error.main", fontSize: 24 }} />;
    default:
      return null;
  }
}

function AssignmentsSection() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {assignments.map((a, i) => (
        <Card
          key={i}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 1,
            py: 1,
            borderRadius: 1,
            bgcolor: "white",
            width: "100%",
          }}
        >
          {/* Left icon */}
          <Box
            sx={{
              width: 32,
              height: 32,
              mr: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getStatusIcon(a.status)}
          </Box>

          {/* Right text */}
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <Typography variant="caption" fontWeight="bold" noWrap>
              {a.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {a.course}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {a.due}
            </Typography>
          </Box>
        </Card>
      ))}
    </Box>
  );
}


// ---------------- MAIN RIGHT SIDEBAR ------------------\

export default function MainRightSidebar({ isOpen, onToggle }) {
  const theme = useTheme();

  return (
    <>
      <Drawer
        variant="persistent"
        anchor="right"
        open={isOpen}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            p: 2,
            width: DRAWER_WIDTH,
            bgcolor: theme.palette.primary.lighter,
            position: 'fixed',
            height: 'calc(100vh - 64px)',
            top: '64px',
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            transition: theme.transitions.create('width', {
              duration: theme.transitions.duration.standard,
            }),

            /* Custom scrollbar */
            '&::-webkit-scrollbar': {
              width: '5px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: theme.palette.primary.lighter,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.primary.main,
              borderRadius: '3px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }}
      >

        {/* Content inside drawer */}
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center",
                  p: 1, width: "100%", gap: "2em"}}
        >
          {/* Calendar Section */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Calendar
            </Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <CalendarMini />
            </Box>
          </Box>

          {/* This Semester Section */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              This Semester
            </Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <ThisSemesterSection />
            </Box>
          </Box>

          {/* Assignments Section */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
              Current Assignments
            </Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <AssignmentsSection />
            </Box>
          </Box>

        </Box>
        
      </Drawer>

      {/* Toggle button */}
      <Tooltip title={isOpen ? 'Collapse' : 'Expand'}>

        <IconButton
          onClick={onToggle}
          sx={{
            position: 'fixed',
            top: '4em',
            right: isOpen ? DRAWER_WIDTH : 0,
            zIndex: 1200,
            backgroundColor: 'primary.main',
            borderRadius: '30px 0 0 30px',
            width: "2.5rem",
            height: "3.5rem",
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            transition: theme.transitions.create('right', {
              duration: theme.transitions.duration.shortest,
            }),
          }}
        >
          {isOpen ? (
            <ChevronRight sx={{ color: 'white', fontSize: "2rem" }} />
          ) : (
            <ChevronLeft sx={{ color: 'white', fontSize: "2rem" }} />
          )}
        </IconButton>

      </Tooltip>
    </>
  );
}
