import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  ListItem,
  ListItemText,
  ListItemIcon,
  List,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AssignmentIcon from "@mui/icons-material/Assignment";
import FlagIcon from "@mui/icons-material/Flag";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import { getCalendar, updateCalendar } from "../../utils/api";
import useAuth from "../../hooks/useAuth";

// Helper function to get days in month
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// Helper function to get the day of week for the first day of month (0 = Sunday, 6 = Saturday)
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

export default function StudentCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [confirmDeleteNote, setConfirmDeleteNote] = useState(null);
  const [data, setData] = useState({});
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    // Fetch calendar data from API
    const fetchCalendarData = async () => {
      try {
        const response = await getCalendar(user.username);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        enqueueSnackbar("Failed to fetch calendar data", { variant: "error" });
      }
    };

    fetchCalendarData();
  }, [user]);
  // Generate mock calendar data
  useEffect(() => {
    const generateMockData = () => {
      const events = [];

      const deadlineEvents = (data.deadlines || [])
      .filter((d) => {
        const date = new Date(d.NgayHetHan);
        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth
        );
      })
      .map((d) => ({
        id: d._id,
        type: "assignment",
        title: d.MoTa || "No title",
        date: new Date(d.NgayHetHan),
        editable: false,
      }));
      events.push(...deadlineEvents);

      const quizEvents = (data.baiKiemTras || [])
      .filter((d) => {
        const date = new Date(d.ThoiGianKetThuc);
        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth
        );
      })
      .map((d) => ({
        id: d._id,
        type: "quiz",
        title: d.MoTa || "No title",
        date: new Date(d.ThoiGianKetThuc),
        editable: false,
      }));
      events.push(...quizEvents);
      const notes = (data?.ghichu?.GhiChu || [])
      .filter((d) => {
        const date = new Date(d.ThoiGianTao);
        return (
          date.getFullYear() === currentYear &&
          date.getMonth() === currentMonth
        );
      })
      .map((d) => ({
        id: d.id,
        type: "note",
        title: d.NoiDung,
        date: new Date(d.ThoiGianTao),
        editable: true,
      }));
      events.push(...notes);
      return events;
    };

    setCalendarEvents(generateMockData());
  }, [currentMonth, currentYear, data]);

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    const events = calendarEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
    setSelectedDateEvents(events);
    setNoteText("");
  };
  const updateNotes = async (newData) => {
    try {
      await updateCalendar(data.id, {SinhVienID: data.id, GhiChu: newData.ghichu.GhiChu});
      setData(newData);
      enqueueSnackbar("Note updated successfully", { variant: "success" });
    } catch (error) {
      console.error("Error updating note:", error);
      enqueueSnackbar("Failed to update note", { variant: "error" });
    }
  }
  // Handle adding a new note
  const handleAddNote = () => {
    if (!noteText.trim()) {
      enqueueSnackbar("Please enter a note", { variant: "error" });
      return;
    }

    const newNote = {
      id: `note-${Date.now()}`,
      type: "note",
      title: noteText,
      date: selectedDate,
      editable: true,
    };

    setCalendarEvents([...calendarEvents, newNote]);
    setSelectedDateEvents([...selectedDateEvents, newNote]);
    var newData = {
      ...data,
      ghichu: {
        ...data.ghichu,
        GhiChu: [
          ...(data.ghichu?.GhiChu || []),
          {
            id: newNote.id,
            NoiDung: newNote.title,
            ThoiGianTao: newNote.date,
          },
        ],
      }
    }
    updateNotes(newData);
    setNoteText("");
  };

  // Handle deleting a note
  const handleDeleteNote = (noteId) => {
    const updatedCalendarEvents = calendarEvents.filter(
      (event) => event.id !== noteId
    );
    const updatedSelectedDateEvents = selectedDateEvents.filter(
      (event) => event.id !== noteId
    );
    const updatedData = {
      ...data,
      ghichu: {
        ...data.ghichu,
        GhiChu: data.ghichu.GhiChu.filter((note) => note.id !== noteId),
      },
    };
    updateNotes(updatedData);
    setCalendarEvents(updatedCalendarEvents);
    setSelectedDateEvents(updatedSelectedDateEvents);
    setConfirmDeleteNote(null);
  };

  // Close dialogs
  const handleCloseDialog = () => {
    setSelectedDate(null);
    setSelectedDateEvents([]);
  };

  // Render the calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);

    // Create an array of days for the current month
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(currentYear, currentMonth, i));
    }

    // Create weeks (rows)
    const weeks = [];
    let week = [];

    days.forEach((day, index) => {
      week.push(day);

      // Create a new week after 7 days or at the end
      if ((index + 1) % 7 === 0 || index === days.length - 1) {
        // Pad the last week with nulls if needed
        while (week.length < 7) {
          week.push(null);
        }
        weeks.push(week);
        week = [];
      }
    });

    return weeks;
  };

  // Get events for a specific day
  const getEventsForDay = (date) => {
    if (!date) return [];

    return calendarEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  // Render events for a day
  const renderDayEvents = (date) => {
    if (!date) return null;

    const events = getEventsForDay(date);
    const displayCount = 3;
    const displayEvents = events.slice(0, displayCount);
    const remainingCount = events.length - displayCount;

    return (
      <Stack
        spacing={0.5}
        sx={{ mt: 1, maxHeight: "120px", overflow: "hidden" }}
      >
        {displayEvents.map((event) => (
          <Chip
            key={event.id}
            icon={
              event.type === "quiz" ? (
                <AssignmentIcon fontSize="small" />
              ) : event.type === "assignment" ? (
                <FlagIcon fontSize="small" />
              ) : (
                <EditIcon fontSize="small" />
              )
            }
            label={event.title}
            size="small"
            color={
              event.type === "quiz"
                ? "primary"
                : event.type === "assignment"
                ? "warning"
                : "default"
            }
            sx={{
              height: "22px",
              "& .MuiChip-label": {
                fontSize: "0.7rem",
                px: 0.5,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                justifyContent: "flex-start",
                textAlign: "left",
              },
            }}
          />
        ))}
        {remainingCount > 0 && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="caption" color="text.secondary">
              +{remainingCount} more
            </Typography>
          </Box>
        )}
      </Stack>
    );
  };

  // Render event details dialog
  const renderEventDialog = () => {
    if (!selectedDate) return null;

    const formattedDate = dayjs(selectedDate).format("MMMM D, YYYY");
    const isToday = dayjs(selectedDate).isSame(dayjs(), "day");

    return (
      <Dialog
        open={!!selectedDate}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h6">{formattedDate}</Typography>
              {isToday && <Chip size="small" color="primary" label="Today" />}
            </Box>
            <IconButton onClick={handleCloseDialog}>&times;</IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDateEvents.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
              No events for this day
            </Typography>
          ) : (
            <List>
              {selectedDateEvents.map((event) => (
                <ListItem
                  key={event.id}
                  secondaryAction={
                    event.editable && (
                      <IconButton
                        edge="end"
                        onClick={() => setConfirmDeleteNote(event.id)}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                  sx={{
                    borderLeft: 4,
                    borderColor:
                      event.type === "quiz"
                        ? "primary.main"
                        : event.type === "assignment"
                        ? "warning.main"
                        : "divider",
                    mb: 1,
                    backgroundColor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 1,
                  }}
                >
                  <ListItemIcon>
                    {event.type === "quiz" ? (
                      <AssignmentIcon color="primary" />
                    ) : event.type === "assignment" ? (
                      <FlagIcon color="warning" />
                    ) : (
                      <EditIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight="medium">{event.title}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {event.date.toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                          }) + " • Online Submission"}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Add a Personal Note
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your note here..."
              multiline
              rows={2}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNote}
              sx={{ mt: 1 }}
              size="small"
            >
              Add Note
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  // Render delete confirmation dialog
  const renderDeleteConfirmation = () => {
    return (
      <Dialog
        open={!!confirmDeleteNote}
        onClose={() => setConfirmDeleteNote(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteNote(null)}>Cancel</Button>
          <Button
            onClick={() => handleDeleteNote(confirmDeleteNote)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Month names for header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Day names for header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Page title="Calendar View">
      <Box maxWidth={1200} mx="auto" sx={{ mt: 10, p: 2 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "primary.main",
            mb: 4,
          }}
        >
          Calendar View
        </Typography>

        <Paper elevation={3} sx={{ p: 3, overflow: "hidden", mb: 3 }}>
          {/* Calendar Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Button onClick={handlePreviousMonth}>&lt; Previous</Button>
            <Typography variant="h5">
              {monthNames[currentMonth]} {currentYear}
            </Typography>
            <Button onClick={handleNextMonth}>Next &gt;</Button>
          </Box>

          {/* Calendar Grid */}
          <Grid
            container
            spacing={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {/* Day Names Header */}
            {dayNames.map((day, index) => (
              <Grid
                item
                key={index}
                xs={12 / 7}
                sx={{
                  p: 1,
                  textAlign: "center",
                  borderBottom: "1px solid",
                  borderRight: index < 6 ? "1px solid" : "none",
                  borderColor: "divider",
                  backgroundColor: "grey.100",
                  fontWeight: "bold",
                }}
              >
                {day}
              </Grid>
            ))}

            {/* Calendar Cells */}
            {renderCalendar().map((week, weekIndex) =>
              week.map((day, dayIndex) => (
                <Grid
                  item
                  key={`${weekIndex}-${dayIndex}`}
                  xs={12 / 7}
                  sx={{
                    position: "relative",
                    height: 140,
                    p: 1,
                    border: "1px solid",
                    borderTop: "none",
                    borderLeft: "none",
                    borderColor: "divider",
                    backgroundColor:
                      day &&
                      day.getDate() === today.getDate() &&
                      day.getMonth() === today.getMonth() &&
                      day.getFullYear() === today.getFullYear()
                        ? "primary.50"
                        : "white",
                    cursor: day ? "pointer" : "default",
                    "&:hover": {
                      backgroundColor: day ? "action.hover" : "white",
                    },
                    overflow: "hidden",
                  }}
                  onClick={() => day && handleDateClick(day)}
                >
                  {day && (
                    <>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography
                          variant="body2"
                          fontWeight={
                            day.getDate() === today.getDate() &&
                            day.getMonth() === today.getMonth() &&
                            day.getFullYear() === today.getFullYear()
                              ? "bold"
                              : "regular"
                          }
                        >
                          {day.getDate()}
                        </Typography>
                      </Box>
                      {renderDayEvents(day)}
                    </>
                  )}
                </Grid>
              ))
            )}
          </Grid>
        </Paper>

        {renderEventDialog()}

        {renderDeleteConfirmation()}
      </Box>
    </Page>
  );
}
