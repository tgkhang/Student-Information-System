import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Pagination,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TableContainer,
  Paper
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import exportToExcel from "../../utils/exportToExcel";
import {
  getStudentListApi,
  searchStudentApi,
  deleteStudentApi,
  getFacultyListApi
} from "../../utils/api";

const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  } catch (e) {
    return dateString;
  }
};

const statuses = [
  'Studying',
  'On hold',
  'Graduated',
  'Dropped Out'
];

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [faculties, setFaculties] = useState([]);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting state
  const [sortBy, setSortBy] = useState("mssv");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterMajor, setFilterMajor] = useState("");

  // Search state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const formatStudentData = useCallback((student) => {
    if (!student) return null;
    console.log(student);
    try {
      return {
        id: student.mssv || "Not Provided",
        name: student.HoTen || "Not Provided",
        dob: formatDate(student.NgaySinh || "Not Provided"),
        faculty: student.KhoaID.TenKhoa || "Not Provided",
        status: student.TrangThai || "Not Provided",
      };
    } catch (err) {
      console.error("Error formatting student data:", err);
      return null;
    }
  }, []);

  const fetchStudents = useCallback(
    async (
      page = pageNumber,
      size = pageSize,
      sort = sortBy,
      order = sortOrder
    ) => {
      // Prevent multiple simultaneous requests
      if (isFetching) {
        console.log("Request already in progress, skipping");
        return;
      }

      try {
        setIsFetching(true);
        setLoading(true);
        setError(null);

        // Call the API with the required parameters
        const response = await getStudentListApi({
          page,
          size,
          sort,
          order,
        });

        if (
          response?.data &&
          response.data?.data &&
          Array.isArray(response.data.data)
        ) {
          // Update total records and pages for pagination
          setTotalRecords(response.data.total || 0);
          const newTotalPages = Math.max(
            1,
            Math.ceil((response.data.total || 0) / size)
          );
          setTotalPages(newTotalPages);

          // Format student data for display
          const formattedStudents = response.data.data
            .map(formatStudentData)
            .filter(Boolean); // Filter out any null results

          setStudents(formattedStudents);
          setIsSearchActive(false);
          setError(null);
        } else {
          setError("API response format is unexpected");
          setStudents([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(
          `Error fetching student data : ${err.message || "Unknown error"}`
        );
        setStudents([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setIsFetching(false);
      }
    },
    [pageNumber, pageSize, sortBy, sortOrder, formatStudentData, isFetching]
  );

  const searchStudents = useCallback(
    async (searchValue) => {
      // Prevent multiple simultaneous requests
      if (isFetching) {
        console.log("Request already in progress, skipping");
        return;
      }

      if (!searchValue || !searchValue.trim()) {
        setError("Please input search information.");
        return;
      }

      try {
        setIsFetching(true);
        setLoading(true);
        setError(null);

        const response = await searchStudentApi(searchValue.trim());

        if (response?.data) {
          // Check if the API response is an array or a single object
          const studentData = Array.isArray(response.data)
            ? response.data
            : [response.data];

          // Format all students data
          const formattedStudents = studentData
            .map(formatStudentData)
            .filter(Boolean);

          if (formattedStudents.length > 0) {
            setStudents(formattedStudents);
            setTotalRecords(formattedStudents.length);
            setTotalPages(1);
            setIsSearchActive(true);
          } else {
            setError("Student not found");
            setStudents([]);
            setIsSearchActive(true);
          }
        } else {
          setError("Student not found");
          setStudents([]);
          setIsSearchActive(true);
        }
      } catch (err) {
        console.error("Error searching students:", err);
        if (err.response?.status === 404) {
          setError(`No students found for: ${searchValue}`);
        } else {
          setError(
            `Lỗi tìm kiếm: ${
              err.response?.data?.message || err.message || "Unknown error"
            }`
          );
        }

        setStudents([]);
        setIsSearchActive(true);
      } finally {
        setLoading(false);
        setIsFetching(false);
      }
    },
    [formatStudentData, isFetching]
  );

  const deleteStudent = useCallback(
    async (studentId) => {
      if (!studentId) {
        setSnackbarMessage("Invalid student ID");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      try {
        setDeleteLoading(true);

        const response = await deleteStudentApi(studentId);

        setSnackbarMessage(`Student ${studentId} successfully deleted`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        if (isSearchActive) {
          handleClearSearch();
        } else {
          // Refresh current page
          fetchStudents(pageNumber, pageSize, sortBy, sortOrder);
        }
      } catch (err) {
        console.error(`Error deleting student ${studentId}:`, err);

        // Handle deletion error
        const errorMessage =
          err.response?.data?.message || err.message || "Unknown error";
        setSnackbarMessage(`Unable to delete student: ${errorMessage}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setStudentToDelete(null);
      }
    },
    [
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      fetchStudents,
      isSearchActive,
    ]
  );

  const handleDeleteClick = useCallback((student) => {
    setStudentToDelete(student);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
    }
  }, [studentToDelete, deleteStudent]);

  // Handle delete dialog close
  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setStudentToDelete(null);
  }, []);

  // Handle snackbar close
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (event, value) => {
      // Prevent page change if another request is in progress
      if (isFetching) return;

      if (isSearchActive) {
        setIsSearchActive(false);
        setSearchTerm("");
        setPageNumber(value);
        fetchStudents(value, pageSize, sortBy, sortOrder);
      } else {
        setPageNumber(value);
        fetchStudents(value, pageSize, sortBy, sortOrder);
      }
    },
    [isSearchActive, pageSize, sortBy, sortOrder, fetchStudents, isFetching]
  );

  // Handle sort change
  const handleSortChange = useCallback(
    (field) => {
      // Prevent sort change if another request is in progress
      if (isFetching || isSearchActive) return;

      const newOrder = field === sortBy && sortOrder === "asc" ? "desc" : "asc";
      setSortBy(field);
      setSortOrder(newOrder);
      fetchStudents(pageNumber, pageSize, field, newOrder);
    },
    [
      pageNumber,
      pageSize,
      sortBy,
      sortOrder,
      fetchStudents,
      isFetching,
      isSearchActive,
    ]
  );

  // Handle search
  const handleSearch = useCallback(() => {
    // Prevent search if another request is in progress
    if (isFetching) return;
    searchStudents(searchTerm);
  }, [searchTerm, searchStudents, isFetching]);

  // Handle clear search
  const handleClearSearch = useCallback(() => {
    // Prevent clearing if another request is in progress
    if (isFetching) return;
    setSearchTerm("");
    setFilterStatus("");
    setFilterCourse("");
    setFilterMajor("");
    setIsSearchActive(false);
    setPageNumber(1);
    fetchStudents(1, pageSize, sortBy, sortOrder);
  }, [pageSize, sortBy, sortOrder, fetchStudents, isFetching]);

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    try {
      if (isSearchActive) return students;

      if (!Array.isArray(students)) {
        return [];
      }

      return students.filter((student) => {
        if (!student) return false;

        const matchesSearch =
          !searchTerm ||
          (student.name?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          ) ||
          (student.id?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus = !filterStatus || student.status === filterStatus;
        const matchesCourse = !filterCourse || student.faculty === filterCourse;
        const matchesMajor = !filterMajor || student.major === filterMajor;

        return matchesSearch && matchesStatus && matchesCourse && matchesMajor;
      });
    } catch (err) {
      console.error("Error in filteredStudents:", err);
      return [];
    }
  }, [
    students,
    searchTerm,
    filterStatus,
    filterCourse,
    filterMajor,
    isSearchActive,
  ]);

  useEffect(() => {
    const fetchFaculties = async () => {
      setLoading(true);
      try {
        const facultyResponse = await getFacultyListApi({
          page: 1,
          size: 100,
          sort: "TenKhoa",
          order: "asc",
        });
  
        setFaculties(facultyResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching faculties:", error);
        setError("Failed to load faculty list.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchFaculties();
  }, []);  

  return (
    <Page title="Student List">
      <Container maxWidth="xl" sx={{ mt: "64px" }}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              my: 2
            }}
          >
            <Typography variant="h4" gutterBottom
              sx={{color: "primary.main"}}
            >
              Student List {isSearchActive && "- Search Results"}
            </Typography>
            <Button
              color="success"
              variant="contained"
              disabled={
                !filteredStudents || filteredStudents.length === 0 || loading
              }
              onClick={() =>
                exportToExcel(
                  [
                    "Student ID",
                    "Name",
                    "Date of Birth",
                    "Faculty",
                    "Major",
                    "Status",
                  ],
                  filteredStudents.map((student) => [
                    student.id,
                    student.name,
                    student.dob,
                    student.faculty,
                    student.major,
                    student.status,
                  ])
                )
              }
              startIcon={<Iconify icon={"eva:download-fill"} />}
            >
              Export Spreadsheet
            </Button>
          </Stack>

          <Box sx={{ mb: 2, width: "100%" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid fullWidth item xs={12} sm={3.5}>
                <TextField
                  fullWidth
                  label="Name or Student ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Input Name or Student ID"
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleSearch();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid fullWidth item xs={12} sm={2.5}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    disabled={loading || isSearchActive}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid fullWidth item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    value={filterCourse}
                    label="Faculty"
                    onChange={(e) => setFilterCourse(e.target.value)}
                    disabled={loading || isSearchActive}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty.id} value={faculty.TenKhoa}>
                        {faculty.TenKhoa}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid fullWidth item xs={12} sm={3}>
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading || !searchTerm.trim()}
                    sx={{
                      py: "0.9em",
                      px: "2em",
                      fontSize: "1rem",
                    }}
                  >
                    <Iconify icon="eva:search-outline" sx={{ mr: 1 }} />
                    Search
                  </Button>

                  {(isSearchActive ||
                    searchTerm ||
                    filterStatus ||
                    filterCourse ||
                    filterMajor) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClearSearch}
                      disabled={loading}
                      sx={{ height: "4em" }}
                    >
                      <Iconify icon="eva:close-fill" />
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {initialLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              )}
              <TableContainer component={Paper} elevation={0}
                sx={{
                  borderRadius: 2,
                  backgroundColor: "primary.lighter",
                  my: 5
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "primary.main" }}>
                      <TableCell
                        onClick={() => handleSortChange("mssv")}
                        sx={{
                          cursor: !isSearchActive ? "pointer" : "default",
                          color: "primary.lighter",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Student ID
                          {sortBy === "mssv" && !isSearchActive && (
                            <Iconify
                              icon={
                                sortOrder === "asc"
                                  ? "eva:arrow-up-fill"
                                  : "eva:arrow-down-fill"
                              }
                              sx={{ ml: 0.5, width: 16, height: 16 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSortChange("HoTen")}
                        sx={{
                          cursor: !isSearchActive ? "pointer" : "default",
                          color: "primary.lighter",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Name
                          {sortBy === "HoTen" && !isSearchActive && (
                            <Iconify
                              icon={
                                sortOrder === "asc"
                                  ? "eva:arrow-up-fill"
                                  : "eva:arrow-down-fill"
                              }
                              sx={{ ml: 0.5, width: 16, height: 16 }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: "primary.lighter" }}>Date of Birth</TableCell>
                      <TableCell sx={{ color: "primary.lighter" }}>Faculty</TableCell>
                      <TableCell sx={{ color: "primary.lighter" }}>Study Status</TableCell>
                      <TableCell align="center" sx={{ color: "primary.lighter", borderTopRightRadius: "16px" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!loading && filteredStudents.length > 0
                      ? filteredStudents.map((student, index) => (
                          <TableRow key={student.id || `student-${index}`}>
                            <TableCell>{student.id}</TableCell>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.dob}</TableCell>
                            <TableCell>{student.faculty}</TableCell>
                            <TableCell>{student.status}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteClick(student)}
                                disabled={deleteLoading}
                              >
                                <Iconify icon="eva:trash-2-outline" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      : !loading && (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              Không có dữ liệu sinh viên.
                            </TableCell>
                          </TableRow>
                        )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
          {!isSearchActive && totalPages > 1 && !loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                disabled={loading}
                variant="outlined"
                shape="rounded"
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 0,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Confirm Student Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete student {studentToDelete?.name} (Student ID:{" "}
            {studentToDelete?.id})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteLoading}
            startIcon={
              deleteLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : null
            }
          >
            {deleteLoading ? "Deleting..." : "Confirm Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for operation feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Page>
  );
}