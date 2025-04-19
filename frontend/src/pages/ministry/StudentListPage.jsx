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
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import exportToExcel from "../../utils/exportToExcel";
import {
  getStudentListApi,
  searchStudentApi,
  deleteStudentApi,
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
  "Đang học",
  "Bảo lưu",
  "Đã tốt nghiệp",
  "Đang chờ tốt nghiệp",
];
const courses = ["K63", "K64", "K65"]; // Ví dụ về các khóa học
const majors = ["Công nghệ thông tin", "Kinh tế", "Cơ khí", "Xây dựng"]; // Ví dụ về chuyên ngành

export default function StudentListPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

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

  // Delete functionality - new state variables
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const formatStudentData = useCallback((student) => {
    if (!student) return null;
    try {
      return {
        id: student.mssv || "",
        name: student.HoTen || "",
        dob: formatDate(student.NgaySinh || ""),
        course: student.KhoaHoc || "",
        major: student.ChuyenNganh || "",
        status: student.TrangThai || "",
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
          `Không thể tải dữ liệu sinh viên: ${err.message || "Unknown error"}`
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
        setError("Vui lòng nhập thông tin để tìm kiếm");
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
            setError("Không tìm thấy sinh viên phù hợp");
            setStudents([]);
            setIsSearchActive(true);
          }
        } else {
          setError("Không tìm thấy sinh viên");
          setStudents([]);
          setIsSearchActive(true);
        }
      } catch (err) {
        console.error("Error searching students:", err);
        if (err.response?.status === 404) {
          setError(`Không tìm thấy sinh viên với từ khóa: ${searchValue}`);
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
        setSnackbarMessage("Mã sinh viên không hợp lệ");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      try {
        setDeleteLoading(true);

        const response = await deleteStudentApi(studentId);

        setSnackbarMessage(`Đã xóa sinh viên ${studentId} thành công`);
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
        setSnackbarMessage(`Không thể xóa sinh viên: ${errorMessage}`);
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
        const matchesCourse = !filterCourse || student.course === filterCourse;
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

  return (
    <Page title="Student List">
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ my: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              Danh sách sinh viên {isSearchActive && "- Kết quả tìm kiếm"}
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
                    "Mã sinh viên",
                    "Họ tên",
                    "Ngày sinh",
                    "Khóa học",
                    "Chuyên ngành",
                    "Tình trạng học",
                  ],
                  filteredStudents.map((student) => [
                    student.id,
                    student.name,
                    student.dob,
                    student.course,
                    student.major,
                    student.status,
                  ])
                )
              }
              startIcon={<Iconify icon={"eva:download-fill"} />}
            >
              Xuất Excel
            </Button>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Tìm kiếm theo tên hoặc mã sinh viên"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên hoặc mã số sinh viên"
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
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng học</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Tình trạng học"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    disabled={loading || isSearchActive}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Khóa</InputLabel>
                  <Select
                    value={filterCourse}
                    label="Khóa"
                    onChange={(e) => setFilterCourse(e.target.value)}
                    disabled={loading || isSearchActive}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {courses.map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <FormControl fullWidth>
                  <InputLabel>Chuyên ngành</InputLabel>
                  <Select
                    value={filterMajor}
                    label="Chuyên ngành"
                    onChange={(e) => setFilterMajor(e.target.value)}
                    disabled={loading || isSearchActive}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
                    {majors.map((major) => (
                      <MenuItem key={major} value={major}>
                        {major}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Tìm kiếm"
                    )}
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
                    >
                      <Iconify icon={"eva:close-fill"} />
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {isSearchActive && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleClearSearch}
                  disabled={loading}
                >
                  Quay lại danh sách
                </Button>
              }
            >
              {students.length > 0
                ? `Hiển thị ${students.length} kết quả cho từ khóa: "${searchTerm}"`
                : `Không tìm thấy sinh viên với từ khóa: "${searchTerm}"`}
            </Alert>
          )}

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

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleSortChange("mssv")}
                      sx={{ cursor: !isSearchActive ? "pointer" : "default" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Mã sinh viên
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
                      sx={{ cursor: !isSearchActive ? "pointer" : "default" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        Họ tên
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
                    <TableCell>Ngày sinh</TableCell>
                    <TableCell>Khóa học</TableCell>
                    <TableCell>Chuyên ngành</TableCell>
                    <TableCell>Tình trạng học</TableCell>
                    <TableCell align="center">Thao tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!loading && filteredStudents.length > 0
                    ? filteredStudents.map((student, index) => (
                        <TableRow key={student.id || `student-${index}`}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.dob}</TableCell>
                          <TableCell>{student.course}</TableCell>
                          <TableCell>{student.major}</TableCell>
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
                            Không có dữ liệu sinh viên
                          </TableCell>
                        </TableRow>
                      )}
                </TableBody>
              </Table>
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
          Xác nhận xóa sinh viên
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa sinh viên {studentToDelete?.name} (MSSV:{" "}
            {studentToDelete?.id})? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Hủy
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
            {deleteLoading ? "Đang xóa..." : "Xác nhận xóa"}
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