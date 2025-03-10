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
  "Đang học",
  "Bảo lưu",
  "Đã tốt nghiệp",
  "Đang chờ tốt nghiệp",
];
const courses = ["K63", "K64", "K65"]; // Ví dụ về các khóa học
const majors = ["Công nghệ thông tin", "Kinh tế", "Cơ khí", "Xây dựng"]; // Ví dụ về chuyên ngành

// Hàm tạo dữ liệu giả lập cho 100 sinh viên
function generateStudents() {
  const students = [];
  for (let i = 1; i <= 100; i++) {
    const student = {
      id: `SV${i.toString().padStart(3, "0")}`,
      name: `Sinh viên ${i}`,
      dob: `199${i % 10}-0${(i % 12) + 1}-15`,
      course: courses[i % courses.length],
      major: majors[i % majors.length],
      status: statuses[i % statuses.length],
    };
    students.push(student);
  }
  return students;
}

export default function StudentListPage() {
  const students = useMemo(() => generateStudents(), []);

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
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        student.id.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchesStatus = appliedStatus
        ? student.status === appliedStatus
        : true;
      const matchesCourse = appliedCourse
        ? student.course === appliedCourse
        : true;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [students, appliedSearch, appliedStatus, appliedCourse]);

  // Phân trang: 50 sinh viên mỗi trang
  const pageSize = 50;
  const pageCount = Math.ceil(filteredStudents.length / pageSize);
  const displayedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Page title="Student List">
      <Container maxWidth="lg">
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
                  label="Tìm kiếm theo tên hoặc mã sinh viên"
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
                <TableCell>Mã sinh viên</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Ngày sinh</TableCell>
                <TableCell>Khóa học</TableCell>
                <TableCell>Chuyên ngành</TableCell>
                <TableCell>Tình trạng học</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.dob}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.status}</TableCell>
                </TableRow>
              ))}
              {displayedStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Không tìm thấy sinh viên nào.
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
