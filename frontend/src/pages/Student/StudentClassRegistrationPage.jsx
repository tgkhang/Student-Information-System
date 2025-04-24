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
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  styled,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ScheduleIcon from "@mui/icons-material/Schedule";
import Page from "../../components/Page";
import {
  studentRegister,
  getListCourseRegister,
  studentCancelRegister,
} from "../../utils/api";
import { useEffect, useState } from "react";
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

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Get instructor names as a string
const getInstructorNames = (instructors) => {
  if (!instructors || !instructors.length) return "-";
  return instructors.map((instructor) => instructor.HoTen).join(", ");
};

export default function StudentClassRegistrationPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [classToEnroll, setClassToEnroll] = useState(null);
  const [successAlert, setSuccessAlert] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState({
    field: 'TenKhoaHoc',
    direction: 'asc'
  });

  // Function to fetch all courses
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const response = await getListCourseRegister(user.username);
      console.log("API Response:", response);
      
      if (response && response.data && response.data.data) {
        const allCourses = response.data.data;
        
        // Use the daDangKy property to filter courses
        const registered = allCourses.filter(course => course.daDangKy === true);
        const available = allCourses.filter(course => course.daDangKy === false);
        
        setRegisteredCourses(registered);
        setAvailableCourses(available);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setErrorAlert("Could not fetch courses. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user && user.username) {
      fetchCourses();
    }
  }, [user]);

  // Filter and sort courses based on search term
  const filteredAvailableCourses = availableCourses
    .filter((course) =>
      (course.TenKhoaHoc?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (course.MaKhoaHoc?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (course.MoTa?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortOrder.field];
      const bValue = b[sortOrder.field];
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.direction === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      } else {
        // For numbers or other types
        if (sortOrder.direction === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
    });

  // Handle course registration
  const handleEnrollOpen = (course) => {
    setClassToEnroll(course);
    setEnrollDialogOpen(true);
  };

  const handleEnrollConfirm = async () => {
    try {
      if (!classToEnroll || !classToEnroll._id) {
        setErrorAlert("Invalid course selection");
        return;
      }

      // Using courseId directly as per API definition
      const response = await studentRegister(classToEnroll.MaKhoaHoc);

      if (response && response.data) {
        setSuccessAlert(`Successfully enrolled in ${classToEnroll.TenKhoaHoc}`);
        fetchCourses(); // Refresh course lists
      }
    } catch (error) {
      console.error("Error enrolling in course:", error);
      setErrorAlert(error.response?.data?.message || "Failed to enroll in course");
    } finally {
      setEnrollDialogOpen(false);
      setClassToEnroll(null);
    }
  };

  // Handle course cancellation
  const handleDeleteOpen = (course) => {
    setClassToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      if (!classToDelete || !classToDelete._id) {
        setErrorAlert("Invalid course selection");
        return;
      }
      console.log(classToDelete._id)
      const response = await studentCancelRegister({_id : classToDelete._id}, user.username);

      if (response && response.data) {
        setSuccessAlert(`Successfully canceled registration for ${classToDelete.TenKhoaHoc}`);
        fetchCourses(); // Refresh course lists
      }
    } catch (error) {
      console.error("Error canceling registration:", error);
      setErrorAlert(error.response?.data?.message || "Failed to cancel registration");
    } finally {
      setDeleteDialogOpen(false);
      setClassToDelete(null);
    }
  };

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (successAlert) {
      const timer = setTimeout(() => {
        setSuccessAlert("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successAlert]);

  useEffect(() => {
    if (errorAlert) {
      const timer = setTimeout(() => {
        setErrorAlert("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorAlert]);

  return (
    <Page title="Class Registration">
      <Box sx={{ display: "flex", p: 1 }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
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
            Class Registration
          </Typography>

          {/* Alerts */}
          {successAlert && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
              onClose={() => setSuccessAlert("")}
            >
              {successAlert}
            </Alert>
          )}
          
          {errorAlert && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
              onClose={() => setErrorAlert("")}
            >
              {errorAlert}
            </Alert>
          )}

          {/* My Registered Courses Section */}
          <Card sx={{ mb: 4, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                My Registered Courses ({registeredCourses.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {registeredCourses.length === 0 ? (
                <Typography variant="body1" sx={{ py: 2, textAlign: "center", color: "text.secondary" }}>
                  You haven't registered for any courses yet.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Schedule</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {registeredCourses.map((course) => {
                        // Format schedule information
                        let scheduleInfo = "Not scheduled";
                        if (course.LichHoc && course.LichHoc.length > 0) {
                          const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                          const firstSchedule = course.LichHoc[0];
                          scheduleInfo = `${days[firstSchedule.NgayHoc] || 'Day ' + firstSchedule.NgayHoc}, ${firstSchedule.ThoiGianBatDau}-${firstSchedule.ThoiGianKetThuc}`;
                          if (firstSchedule.DiaDiem) {
                            scheduleInfo += `, ${firstSchedule.DiaDiem}`;
                          }
                        }
                        
                        return (
                          <StyledTableRow key={course._id}>
                            <TableCell>{course.MaKhoaHoc}</TableCell>
                            <TableCell>
                              <Tooltip title={course.MoTa || "No description available"}>
                                <span>{course.TenKhoaHoc}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{getInstructorNames(course.GiangVienID)}</TableCell>
                            <TableCell>{course.SoTinChi}</TableCell>
                            <TableCell>{formatDate(course.NgayBatDau)}</TableCell>
                            <TableCell>{formatDate(course.NgayKetThuc)}</TableCell>
                            <TableCell>
                              <Tooltip title={scheduleInfo}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    maxWidth: 150,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  }}
                                >
                                  {scheduleInfo}
                                </Typography>
                              </Tooltip>
                            </TableCell>
                            <TableCell>
                              <Tooltip title="Cancel Registration">
                                <IconButton
                                  color="error"
                                  onClick={() => handleDeleteOpen(course)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Loading Indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Typography>Loading courses...</Typography>
            </Box>
          )}
          
          {/* Available Courses Section */}
          <Card sx={{ boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Available Courses ({filteredAvailableCourses.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: 300 }}
                  />
                </Box>
              </Box>
              <Divider sx={{ mb: 2 }} />
              
              {filteredAvailableCourses.length === 0 ? (
                <Typography variant="body1" sx={{ py: 2, textAlign: "center", color: "text.secondary" }}>
                  No available courses found.
                </Typography>
              ) : (
                <TableContainer component={Paper} sx={{ boxShadow: 0 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Course Code</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Instructor</TableCell>
                        <TableCell>Credits</TableCell>
                        <TableCell>Available Slots</TableCell>
                        <TableCell>Registration Deadline</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAvailableCourses.map((course) => {
                        // Check if registration deadline has passed
                        const deadlinePassed = new Date(course.HanDangKy) < new Date();
                        const isFull = course.SoLuongSinhVienDangKy >= course.SoLuongToiDa;
                        const buttonDisabled = deadlinePassed || isFull;
                        
                        let buttonTooltip = "";
                        if (deadlinePassed) {
                          buttonTooltip = "Registration deadline has passed";
                        } else if (isFull) {
                          buttonTooltip = "Class is full";
                        }
                        
                        return (
                          <StyledTableRow key={course._id}>
                            <TableCell>{course.MaKhoaHoc}</TableCell>
                            <TableCell>
                              <Tooltip title={course.MoTa || "No description available"}>
                                <span>{course.TenKhoaHoc}</span>
                              </Tooltip>
                            </TableCell>
                            <TableCell>{getInstructorNames(course.GiangVienID)}</TableCell>
                            <TableCell>{course.SoTinChi}</TableCell>
                            <TableCell>
                              {course.SoLuongSinhVienDangKy}/{course.SoLuongToiDa}
                            </TableCell>
                            <TableCell>
                              {formatDate(course.HanDangKy)}
                              {deadlinePassed && (
                                <Chip 
                                  size="small" 
                                  color="error" 
                                  label="Expired" 
                                  sx={{ ml: 1 }} 
                                />
                              )}
                            </TableCell>
                            <TableCell>
                              <Tooltip title={buttonTooltip || "Register for this course"}>
                                <span>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleEnrollOpen(course)}
                                    disabled={buttonDisabled}
                                  >
                                    Enroll
                                  </Button>
                                </span>
                              </Tooltip>
                            </TableCell>
                          </StyledTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* Cancel Registration Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
          >
            <DialogTitle>Cancel Course Registration</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to cancel your registration for{" "}
                <strong>{classToDelete?.TenKhoaHoc}</strong>? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                No, Keep It
              </Button>
              <Button onClick={handleDeleteConfirm} color="error">
                Yes, Cancel Registration
              </Button>
            </DialogActions>
          </Dialog>

          {/* Enroll Dialog */}
          <Dialog
            open={enrollDialogOpen}
            onClose={() => setEnrollDialogOpen(false)}
          >
            <DialogTitle>Confirm Enrollment</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to enroll in{" "}
                <strong>{classToEnroll?.TenKhoaHoc}</strong>?
              </DialogContentText>
              {classToEnroll && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Course Code:
                      </Typography>
                      <Typography variant="body1">
                        {classToEnroll.MaKhoaHoc}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Credits:
                      </Typography>
                      <Typography variant="body1">
                        {classToEnroll.SoTinChi}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Instructor:
                      </Typography>
                      <Typography variant="body1">
                        {getInstructorNames(classToEnroll.GiangVienID)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Description:
                      </Typography>
                      <Typography variant="body1">
                        {classToEnroll.MoTa || "No description available"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEnrollDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEnrollConfirm} color="primary" variant="contained">
                Confirm Enrollment
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Page>
  );
}