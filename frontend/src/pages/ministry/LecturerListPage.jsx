import { useState, useEffect } from "react";
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
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
// utils
import exportToExcel from "../../utils/exportToExcel";
import { getTeacherListApi, getFacultyListApi } from "../../utils/api";

const statuses = ["Đang công tác", "Nghỉ hưu", "Nghỉ phép", "Nghỉ việc"];

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

  // Map faculty IDs to faculty names
  const facultyMap = {};
  faculties.forEach((faculty) => {
    facultyMap[faculty._id] = {
      id: faculty._id,
      code: faculty.MaKhoa,
      name: faculty.TenKhoa,
    };
  });

  // Fetch data
  const fetchData = async () => {
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
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize]);

  // Process lecturer data to include faculty name
  const processedLecturers = lecturers.map((lecturer) => {
    const faculty = facultyMap[lecturer.KhoaID] || { name: "Not Provided" };

    return {
      ...lecturer,
      id: lecturer.MaGV,
      name: lecturer.HoTen,
      department: faculty.name,
      departmentId: lecturer.KhoaID,
      position: lecturer.ChucVu || "Thành viên",
      status: "Đang công tác",
      academicTitle: lecturer.TrinhDo || "Chưa cập nhật",
      specialization: "Chưa cập nhật",
      dob: lecturer.NgaySinh
        ? new Date(lecturer.NgaySinh).toLocaleDateString()
        : "Chưa cập nhật",
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
          "Thành viên": 3,
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

  // Hàm để hiển thị chip trạng thái với màu sắc tương ứng
  const getStatusChip = (status) => {
    let color = "default";
    switch (status) {
      case "Đang công tác":
        color = "success";
        break;
      case "Nghỉ hưu":
        color = "secondary";
        break;
      case "Nghỉ phép":
        color = "warning";
        break;
      case "Nghỉ việc":
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
      <Container maxWidth="lg"  sx={{ mt: 10 }}>
        <Box sx={{ my: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h4" gutterBottom>
              Danh sách giảng viên
            </Typography>
            <Button
              color="success"
              variant="contained"
              disabled={filteredLecturers.length === 0 || loading}
              onClick={() =>
                exportToExcel(
                  [
                    "Mã giảng viên",
                    "Họ tên",
                    "Ngày sinh",
                    "Khoa",
                    "Chức vụ",
                    "Tình trạng",
                    "Học hàm/học vị",
                    "Chuyên ngành",
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
              Xuất Excel
            </Button>
          </Stack>

          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Tìm kiếm theo tên hoặc mã"
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
                  <InputLabel>Khoa</InputLabel>
                  <Select
                    value={filterDepartment}
                    label="Khoa"
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
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
                  <InputLabel>Học hàm/Học vị</InputLabel>
                  <Select
                    value={filterTitle}
                    label="Học hàm/Học vị"
                    onChange={(e) => setFilterTitle(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
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
                  <InputLabel>Tình trạng</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Tình trạng"
                    onChange={(e) => setFilterStatus(e.target.value)}
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
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                  sx={{ height: "56px" }}
                  disabled={loading}
                >
                  Tìm kiếm
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
                                lecturer.position !== "Thành viên" ? 3 : 1,
                            }}
                          >
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
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    <strong>Sinh nhật:</strong> {lecturer.dob}
                                  </Typography>
                                  <Typography
                                    variant="body2"
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
    </Page>
  );
}
