import { useState, useEffect, useMemo } from "react";
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
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import exportToExcel from "../../utils/exportToExcel";
import { getStudentListApi, getStudentByMssvApi } from "../../utils/api";
import { fi } from "date-fns/locale";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting state
  const [sortBy, setSortBy] = useState("mssv");
  const [sortOrder, setSortOrder] = useState("asc");

  // Trạng thái nhập liệu (chưa áp dụng)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  // Trạng thái áp dụng cho tìm kiếm và bộ lọc
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedCourse, setAppliedCourse] = useState("");

  const [isIdSearch, setIsIdSearch] = useState(false);

  const fetchStudents = async (
    page = pageNumber,
    size = pageSize,
    sort = sortBy,
    order = sortOrder
  ) => {
    try {
      setLoading(true);
      // Call the API with the required parameters
      const response = await getStudentListApi({
        page,
        size,
        sort,
        order,
      });
      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data)
      ) {
        // Update total records and pages for pagination
        setTotalRecords(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / size));

        // Format student data for display
        const formattedStudents = response.data.data.map((student) => ({
          id: student.mssv || "",
          name: student.HoTen || "",
          dob: formatDate(student.NgaySinh || ""),
          course: student.KhoaHoc || "",
          major: student.ChuyenNganh || "",
          status: student.TrangThai || "",
        }));
        setStudents(formattedStudents);
        setError(null);
        setIsIdSearch(false);
      } else {
        setError("API response format is unexpected");
      }
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError(`Không thể tải dữ liệu sinh viên: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentById = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getStudentByMssvApi(id);
      if (response.data) {
        const student = response.data;

        const formattedStudent = {
          id: student.mssv || "",
          name: student.HoTen || "",
          dob: formatDate(student.NgaySinh || ""),
          course: student.KhoaHoc || "",
          major: student.ChuyenNganh || "",
          status: student.TrangThai || "",
        };

        setStudents([formattedStudent]);
        setTotalRecords(1);
        setTotalPages(1);
        setIsIdSearch(true);
      } else {
        setError("Không tìm thấy sinh viên");
        setStudents([]);
      }
    } catch (err) {
      console.error("Error fetching student by ID:", err);
      setError(`Không tìm thấy sinh viên với mã: ${id}`);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle page change
  const handlePageChange = (event, value) => {
    if (isIdSearch) {
      setIsIdSearch(false);
      setSearchTerm("");
      setAppliedSearch("");
      setPageNumber(value);
      fetchStudents(value, pageSize, sortBy, sortOrder);
    } else {
      setPageNumber(value);
      fetchStudents(value, pageSize, sortBy, sortOrder);
    }
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (isIdSearch) return;
    const newOrder = filed === sortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newOrder);
    fetchStudents(pageNumber, pageSize, field, newOrder);
  };

  // Handle search
  const handleSearch = () => {
    if (isIdSearch) {
      fetchStudentById(searchTerm);
    } else {
      setAppliedSearch(searchTerm);
      setAppliedStatus(filterStatus);
      setAppliedCourse(filterCourse);
      fetchStudents(pageNumber, pageSize, sortBy, sortOrder);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilterStatus("");
    setFilterCourse("");
    setAppliedSearch("");
    setAppliedStatus("");
    setAppliedCourse("");
    setIsIdSearch(false);
    fetchStudents(1, pageSize, sortBy, sortOrder);
  };

  // Lọc danh sách sinh viên dựa trên trạng thái đã áp dụng (applied)
  const filteredStudents = useMemo(() => {
    if (isIdSearch) return students;

    return students.filter((student) => {
      const matchesSearch =
        !appliedSearch ||
        (student.name?.toLowerCase() || "").includes(
          appliedSearch.toLowerCase()
        );

      const matchesStatus = !appliedStatus || student.status === appliedStatus;
      const matchesCourse = !appliedCourse || student.course === appliedCourse;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, appliedSearch, appliedStatus, appliedCourse, isIdSearch]);

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
              Danh sách sinh viên
            </Typography>
            <Button
              color="success"
              variant="contained"
              disabled={filteredStudents.length === 0}
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
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tìm kiếm theo tên hoặc mã sinh viên"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên hoặc mã số sinh viên"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng học</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Tình trạng học"
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
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Khóa</InputLabel>
                  <Select
                    value={filterCourse}
                    label="Khóa"
                    onChange={(e) => setFilterCourse(e.target.value)}
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
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                  >
                    Tìm kiếm
                  </Button>
                  {(isIdSearch ||
                    appliedSearch ||
                    appliedStatus ||
                    appliedCourse) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClearSearch}
                    >
                      <Iconify icon={"eva:close-fill"} />
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {isIdSearch && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Hiển thị kết quả cho mã sinh viên: {appliedSearch}
              <Button
                size="small"
                color="inherit"
                sx={{ ml: 2 }}
                onClick={handleClearSearch}
              >
                Quay lại danh sách
              </Button>
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleSortChange("mssv")}
                    sx={{ cursor: "pointer" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Mã sinh viên
                      {sortBy === "mssv" && (
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
                    sx={{ cursor: "pointer" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      Họ tên
                      {sortBy === "HoTen" && (
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
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.dob}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.major}</TableCell>
                    <TableCell>{student.status}</TableCell>
                  </TableRow>
                ))}
                {filteredStudents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Không có dữ liệu sinh viên
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {!isIdSearch && totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
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
    </Page>
  );
}
