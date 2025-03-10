import { useState, useMemo } from "react";
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
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
// utils
import exportToExcel from "../../utils/exportToExcel";

const statuses = [
  "Đang công tác",
  "Nghỉ hưu",
    "Nghỉ phép",
    "Nghỉ việc"
];
const positions = ["Phó khoa", "Trưởng khoa", "Thành viên"];
const departments = [
  "Khoa Công nghệ thông tin",
  "Khoa Kinh tế",
  "Khoa Cơ khí",
  "Khoa Xây dựng"
];

// Hàm tạo dữ liệu giả lập cho 50 giảng viên
function generateLecturers() {
  const lecturers = [];
  for (let i = 1; i <= 150; i++) {
    const lecturer = {
      id: `GV${i.toString().padStart(3, "0")}`,
      name: `Giảng viên ${i}`,
      dob: `196${i % 10}-0${(i % 12) + 1}-15`,
      department: departments[i % departments.length],
      position: positions[i % positions.length],
      status: statuses[i % statuses.length],
    };
    lecturers.push(lecturer);
  }
  return lecturers;
}

export default function LecturerListPage() {
  const lecturers = useMemo(() => generateLecturers(), []);

  // Trạng thái nhập liệu (chưa áp dụng)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  // Trạng thái áp dụng cho tìm kiếm và bộ lọc
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedCourse, setAppliedCourse] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  // Khi nhấn nút Tìm kiếm, cập nhật trạng thái áp dụng và reset trang về 1
  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedStatus(filterStatus);
    setAppliedCourse(filterCourse);
    setCurrentPage(1);
  };

  // Lọc danh sách sinh viên dựa trên trạng thái đã áp dụng (applied)
  const filteredlecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const matchesSearch =
        lecturer.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        lecturer.id.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchesStatus = appliedStatus
        ? lecturer.status === appliedStatus
        : true;
      const matchesCourse = appliedCourse
        ? lecturer.department === appliedCourse
        : true;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [lecturers, appliedSearch, appliedStatus, appliedCourse]);

  const pageSize = 50;
  const pageCount = Math.ceil(filteredlecturers.length / pageSize);
  const displayedlecturers = filteredlecturers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Page title="Lecturer List">
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              Danh sách giảng viên
            </Typography>
            <Button
              color="success"
              variant="contained"
              disabled={filteredlecturers.length === 0}
              onClick={() =>
                exportToExcel(
                  [
                    "Mã giảng viên",
                    "Họ tên",
                    "Ngày sinh",
                    "Khoa",
                    "Chức vụ",
                    "Tình trạng",

                  ],
                  filteredlecturers.map((lecturer) => [
                    lecturer.id,
                    lecturer.name,
                    lecturer.dob,
                    lecturer.department,
                    lecturer.position,
                    lecturer.status,
                  ])
                )}
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
                  label="Tìm kiếm theo tên hoặc mã giảng viên"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Tình trạng công tác</InputLabel>
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
                  <InputLabel>Khoa</InputLabel>
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
                    {departments.map((course) => (
                      <MenuItem key={course} value={course}>
                        {course}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSearch}
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          </Box>
          {/* Bảng hiển thị danh sách sinh viên */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã giảng viên</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Khoa</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Tình trạng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedlecturers.map((lecturer) => (
                <TableRow key={lecturer.id}>
                  <TableCell>{lecturer.id}</TableCell>
                  <TableCell>{lecturer.name}</TableCell>
                  <TableCell>{lecturer.dob}</TableCell>
                    <TableCell>{lecturer.department}</TableCell>
                    <TableCell>{lecturer.position}</TableCell>
                    <TableCell>{lecturer.status}</TableCell>
                </TableRow>
              ))}
              {displayedlecturers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy giảng viên nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {/* Phân trang */}
          {pageCount > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
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
