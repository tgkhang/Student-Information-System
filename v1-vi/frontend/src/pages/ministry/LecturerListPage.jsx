import { useState, useEffect, useCallback } from "react";
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
  Grid,
  Stack,
  Card,
  CardContent,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
// utils
import exportToExcel from "../../utils/exportToExcel";
import {  getTeacherListApi, getFacultyListApi,deleteTeacherApi, } from "../../utils/api";

const statuses = ["Working", "Retired", "On Leave", "Resigned"]

const academicTitles = [
  "Giáo sư",
  "Phó Giáo sư",
  "Tiến sĩ",
  "Thạc sĩ",
  "Cử nhân",
];

export default function LecturerListPage() {
  // State for data
  const [lecturers, setLecturers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterTitle, setFilterTitle] = useState("");

  // Applied filters
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedDepartment, setAppliedDepartment] = useState("");
  const [appliedTitle, setAppliedTitle] = useState("");

  // UI state
  const [expandedDept, setExpandedDept] = useState(null);

  // Delete functionality
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch faculty list
      const facultyResponse = await getFacultyListApi({
        page: 1,
        size: 100,
        sort: "TenKhoa",
        order: "asc",
      });

      setFaculties(facultyResponse.data.data || []);

      //fetch lecturer list
      const lecturerResponse = await getTeacherListApi({
        page,
        size: pageSize,
        sort: "HoTen",
        order: "asc",
      });

      const lecturerData = lecturerResponse.data.data || [];
      setLecturers(lecturerData);
      setTotalItems(lecturerResponse.data.total || 0);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Please try again later.");
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Delete teacher function - fixed to use correct variables and refresh logic
  const deleteTeacher = useCallback(
    async (teacherId) => {
      if (!teacherId) {
        setSnackbarMessage("Invalid teacher ID");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      try {
        setDeleteLoading(true);

        // Call the delete API
        await deleteTeacherApi(teacherId);

        // Show success message
        setSnackbarMessage(`Lecturer ${teacherId} successfully deleted`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Refresh data
        fetchData();
      } catch (err) {
        console.error(`Error deleting lecturer ${teacherId}:`, err);

        // Handle deletion error
        const errorMessage =
          err.response?.data?.message || err.message || "Unknown error";
        setSnackbarMessage(`Unable to delete lecturer: ${errorMessage}`);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setTeacherToDelete(null);
      }
    },
    [fetchData]
  );

  const handleDeleteClick = useCallback((teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (teacherToDelete) {
      deleteTeacher(teacherToDelete.id);
    }
  }, [teacherToDelete, deleteTeacher]);

  // Handle delete dialog close
  const handleDeleteDialogClose = useCallback(() => {
    setDeleteDialogOpen(false);
    setTeacherToDelete(null);
  }, []);

  // Handle snackbar close
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  // Handle clear search/filters
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterDepartment("");
    setFilterTitle("");
    setAppliedSearch("");
    setAppliedStatus("");
    setAppliedDepartment("");
    setAppliedTitle("");
    setPage(1);
    fetchData();
  }, [fetchData]);

  // Map faculty IDs to faculty names
  const facultyMap = {};
  faculties.forEach((faculty) => {
    facultyMap[faculty._id] = {
      id: faculty._id,
      code: faculty.MaKhoa,
      name: faculty.TenKhoa,
    };
  });

  // Process lecturer data to include faculty name
  const processedLecturers = lecturers.map((lecturer) => {
    const faculty = facultyMap[lecturer.KhoaID] || { name: "Not Provided" };

    return {
      ...lecturer,
      id: lecturer.MaGV,
      name: lecturer.HoTen,
      department: faculty.name,
      departmentId: lecturer.KhoaID,
      position: lecturer.ChucVu || "Teacher",
      status: lecturer.Status || "Working",
      academicTitle: lecturer.TrinhDo || "Not Provided",
      specialization: "Not Provided",
      dob: lecturer.NgaySinh
        ? new Date(lecturer.NgaySinh).toLocaleDateString()
        : "Not Provided",
      //MOck avatar
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        lecturer.HoTen
      )}&background=random`,
    };
  });

  // Group lecturers by department
  const groupLecturersByDepartment = (lecturers) => {
    const departments = {};

    lecturers.forEach((lecturer) => {
      if (!departments[lecturer.department]) {
        departments[lecturer.department] = [];
      }
      departments[lecturer.department].push(lecturer);
    });

    // Sort lecturers within each department
    Object.keys(departments).forEach((dept) => {
      departments[dept] = departments[dept].sort((a, b) => {
        // Sort by position first
        const positionOrder = {
          "Trưởng khoa": 1,
          "Phó khoa": 2,
          "Giáo viên": 3,
        };

        const aPosition = positionOrder[a.position] || 999;
        const bPosition = positionOrder[b.position] || 999;

        if (aPosition !== bPosition) {
          return aPosition - bPosition;
        }

        //sort by name
        return a.name.localeCompare(b.name);
      });
    });

    return departments;
  };
  // Filter lecturers based on applied filters
  const filteredLecturers = processedLecturers.filter((lecturer) => {
    const matchesSearch =
      !appliedSearch ||
      lecturer.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
      lecturer.id.toLowerCase().includes(appliedSearch.toLowerCase());

    const matchesStatus = !appliedStatus || lecturer.status === appliedStatus;

    const matchesDepartment =
      !appliedDepartment || lecturer.department === appliedDepartment;

    const matchesTitle =
      !appliedTitle || lecturer.academicTitle === appliedTitle;

    return matchesSearch && matchesStatus && matchesDepartment && matchesTitle;
  });

  // Group filtered lecturers by department
  const groupedLecturers = groupLecturersByDepartment(filteredLecturers);

  // Khi nhấn nút Tìm kiếm, cập nhật trạng thái áp dụng và reset trang về 1
  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedStatus(filterStatus);
    setAppliedDepartment(filterDepartment);
    setAppliedTitle(filterTitle);
    setPage(1);
  };

  const handleAccordionChange = (dept) => (event, isExpanded) => {
    setExpandedDept(isExpanded ? dept : null);
  };

// Function to return a status chip with corresponding color
const getStatusChip = (status) => {
  let color = "default";
  switch (status) {
    case "Working":
      color = "success";
      break;
    case "Retired":
      color = "secondary";
      break;
    case "On Leave":
      color = "warning";
      break;
    case "Resigned":
      color = "error";
      break;
    default:
      color = "default";
  }
  return <Chip label={status} color={color} size="small" />;
};

  // Hàm để hiển thị chip chức vụ với màu sắc tương ứng
  const getPositionChip = (position) => {
    let color = "default";
    switch (position) {
      case "Trưởng khoa":
        color = "primary";
        break;
      case "Phó khoa":
        color = "info";
        break;
      default:
        color = "default";
    }
    return <Chip label={position} color={color} size="small" />;
  };

  return (
    <Page title="Lecturer List">
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
              Lecturer List
            </Typography>
            <Stack direction="row" spacing={2}>
              {(appliedSearch ||
                appliedStatus ||
                appliedDepartment ||
                appliedTitle) && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClearSearch}
                  startIcon={<Iconify icon="eva:refresh-outline" />}
                  disabled={loading}
                >
                  Refresh
                </Button>
              )}
              <Button
                color="success"
                variant="contained"
                disabled={filteredLecturers.length === 0 || loading}
                onClick={() =>
                  exportToExcel(
                    [
                      "Teacher ID",
                      "Name",
                      "Date of Birth",
                      "Faculty",
                      "Position",
                      "Status",
                      "Degree",
                      "Major",
                    ],
                    filteredLecturers.map((lecturer) => [
                      lecturer.id,
                      lecturer.name,
                      lecturer.dob,
                      lecturer.department,
                      lecturer.position,
                      lecturer.status,
                      lecturer.academicTitle,
                      lecturer.specialization,
                    ])
                  )
                }
                startIcon={<Iconify icon={"eva:download-fill"} />}
              >
                Export Spreadsheet
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ mb: 5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Name or Teacher ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    value={filterDepartment}
                    label="Faculty"
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {faculties.map((faculty) => (
                      <MenuItem key={faculty._id} value={faculty.TenKhoa}>
                        {faculty.TenKhoa}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Degree</InputLabel>
                  <Select
                    value={filterTitle}
                    label="Degree"
                    onChange={(e) => setFilterTitle(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {academicTitles.map((title) => (
                      <MenuItem key={title} value={title}>
                        {title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
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
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{
                    py: "0.9em",
                    px: "2em",
                    fontSize: "1rem",
                  }}
                >
                  <Iconify icon="eva:search-outline" sx={{ mr: 1 }} />
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Error message */}
          {error && (
            <Card sx={{ p: 3, textAlign: "center", mb: 2 }}>
              <Typography variant="body1" color="error">
                {error}
              </Typography>
            </Card>
          )}

          {/* Display lecturer data by department */}
          {!loading && !error && Object.keys(groupedLecturers).length > 0
            ? Object.keys(groupedLecturers).map((dept) => (
                <Accordion
                  key={dept}
                  expanded={expandedDept === dept}
                  onChange={handleAccordionChange(dept)}
                  sx={{ mb: 2, borderRadius: "8px", overflow: "hidden" }}
                >
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-down-fill" />}
                    sx={{
                      bgcolor: "primary.lighter",
                      "&.Mui-expanded": {
                        minHeight: "64px",
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify
                        icon="fluent:building-24-regular"
                        width={24}
                        height={24}
                      />
                      <Typography variant="h6">{dept}</Typography>
                      <Chip
                        label={`${groupedLecturers[dept].length} giảng viên`}
                        size="small"
                        color="primary"
                      />
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {groupedLecturers[dept].map((lecturer) => (
                        <Grid item xs={12} md={6} key={lecturer.id}>
                          <Card
                            sx={{
                              display: "flex",
                              borderRadius: "8px",
                              border:
                                lecturer.position === "Trưởng khoa"
                                  ? "1px solid #1976d2"
                                  : lecturer.position === "Phó khoa"
                                  ? "1px solid #0288d1"
                                  : "none",
                              boxShadow:
                                lecturer.position !== "Giáo viên" ? 3 : 1,
                              position: "relative",
                            }}
                          >
                            {/* Delete button */}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteClick(lecturer)}
                              disabled={deleteLoading}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                zIndex: 1,
                              }}
                            >
                              <Iconify icon="eva:trash-2-outline" />
                            </IconButton>

                            <Box sx={{ pl: 2, pt: 2, pb: 2 }}>
                              <Avatar
                                src={lecturer.avatar}
                                alt={lecturer.name}
                                sx={{
                                  width: 100,
                                  height: 100,
                                  border: "2px solid",
                                  borderColor:
                                    lecturer.position === "Trưởng khoa"
                                      ? "primary.main"
                                      : lecturer.position === "Phó khoa"
                                      ? "info.main"
                                      : "grey.300",
                                }}
                              />
                            </Box>
                            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                              <Stack spacing={1}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="subtitle1"
                                    fontWeight="bold"
                                  >
                                    {lecturer.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    ({lecturer.id})
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Chip
                                    label={lecturer.academicTitle}
                                    size="small"
                                    color={
                                      lecturer.academicTitle === "Giáo sư"
                                        ? "error"
                                        : lecturer.academicTitle ===
                                          "Phó Giáo sư"
                                        ? "warning"
                                        : lecturer.academicTitle === "Tiến sĩ"
                                        ? "success"
                                        : "default"
                                    }
                                    variant="outlined"
                                  />
                                  {getPositionChip(lecturer.position)}
                                  {getStatusChip(lecturer.status)}
                                </Box>

                                <Stack direction="row" spacing={3}>
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    <strong>Sinh nhật:</strong> {lecturer.dob}
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    <strong>Chuyên ngành:</strong>{" "}
                                    {lecturer.specialization}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))
            : !loading && (
                <Card sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body1">
                    Không tìm thấy giảng viên nào phù hợp với tiêu chí tìm kiếm.
                  </Typography>
                </Card>
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
          Xác nhận xóa giảng viên
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa giảng viên {teacherToDelete?.name} (Mã GV:{" "}
            {teacherToDelete?.id})? Hành động này không thể hoàn tác.
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
