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
  Pagination,
  Grid,
  Stack,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
// utils
import exportToExcel from "../../utils/exportToExcel";

const statuses = ["Đang công tác", "Nghỉ hưu", "Nghỉ phép", "Nghỉ việc"];

const academicTitles = [
  "Giáo sư",
  "Phó Giáo sư",
  "Tiến sĩ",
  "Thạc sĩ",
  "Cử nhân",
];

const academicGroups = {
  "Khoa Công nghệ thông tin": {
    name: "Khoa Công nghệ thông tin",
    dean: {
      id: "GV001",
      name: "Nguyễn Văn An",
      dob: "1965-03-15",
      department: "Khoa Công nghệ thông tin",
      position: "Trưởng khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/1/200/300",
      academicTitle: "Phó Giáo sư",
      specialization: "Khoa học máy tính",
    },
    viceDean: {
      id: "GV002",
      name: "Lê Thị Bình",
      dob: "1970-06-20",
      department: "Khoa Công nghệ thông tin",
      position: "Phó khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/2/200/300",
      academicTitle: "Tiến sĩ",
      specialization: "Trí tuệ nhân tạo",
    },
  },
  "Khoa Kỹ thuật máy tính": {
    name: "Khoa Kỹ thuật máy tính",
    dean: {
      id: "GV003",
      name: "Phạm Văn Cường",
      dob: "1967-09-10",
      department: "Khoa Kỹ thuật máy tính",
      position: "Trưởng khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/3/200/300",
      academicTitle: "Tiến sĩ",
      specialization: "Mạng máy tính",
    },
    viceDean: {
      id: "GV004",
      name: "Trần Thị Dung",
      dob: "1972-12-25",
      department: "Khoa Kỹ thuật máy tính",
      position: "Phó khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/4/200/300",
      academicTitle: "Tiến sĩ",
      specialization: "Kiến trúc máy tính",
    },
  },
  "Khoa Hệ thống thông tin": {
    name: "Khoa Hệ thống thông tin",
    dean: {
      id: "GV005",
      name: "Hoàng Văn Ân",
      dob: "1962-01-15",
      department: "Khoa Hệ thống thông tin",
      position: "Trưởng khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/5/200/300",
      academicTitle: "Giáo sư",
      specialization: "Cơ sở dữ liệu",
    },
    viceDean: {
      id: "GV006",
      name: "Ngô Thị Phương",
      dob: "1975-11-07",
      department: "Khoa Hệ thống thông tin",
      position: "Phó khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/6/200/300",
      academicTitle: "Phó Giáo sư",
      specialization: "Phân tích dữ liệu",
    },
  },
  "Khoa Kỹ thuật phần mềm": {
    name: "Khoa Kỹ thuật phần mềm",
    dean: {
      id: "GV007",
      name: "Đỗ Văn Hùng",
      dob: "1968-07-22",
      department: "Khoa Kỹ thuật phần mềm",
      position: "Trưởng khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/7/200/300",
      academicTitle: "Phó Giáo sư",
      specialization: "Công nghệ phần mềm",
    },
    viceDean: {
      id: "GV008",
      name: "Nguyễn Thị Lan",
      dob: "1974-02-18",
      department: "Khoa Kỹ thuật phần mềm",
      position: "Phó khoa",
      status: "Đang công tác",
      avatar: "https://picsum.photos/id/8/200/300",
      academicTitle: "Tiến sĩ",
      specialization: "Kiểm thử phần mềm",
    },
  },
};

// Hàm tạo dữ liệu giả lập cho 30 giảng viên
function generateLecturers() {
  const departments = Object.keys(academicGroups);
  const lecturers = [];
  
  // Thêm trưởng khoa và phó khoa từ academicGroups
  departments.forEach(dept => {
    lecturers.push(academicGroups[dept].dean);
    lecturers.push(academicGroups[dept].viceDean);
  });
  
  // Thêm các giảng viên thường
  for (let i = 9; i <= 30; i++) {
    const deptIndex = i % departments.length;
    const dept = departments[deptIndex];
    const titleIndex = (i % 5) + 1; // Để đảm bảo phân bố học hàm
    
    const lecturer = {
      id: `GV${i.toString().padStart(3, "0")}`,
      name: `Giảng viên ${i}`,
      dob: `197${i % 10}-0${(i % 12) + 1}-${(i % 28) + 1}`,
      department: dept,
      position: "Thành viên",
      status: statuses[i % statuses.length],
      avatar: `https://picsum.photos/id/${i + 20}/200/300`,
      academicTitle: academicTitles[titleIndex % academicTitles.length],
      specialization: "Chuyên ngành " + (i % 5 + 1),
    };
    lecturers.push(lecturer);
  }
  
  return lecturers;
}

// Hàm sắp xếp giảng viên theo học hàm, học vị
function sortLecturersByRank(lecturers) {
  const rankOrder = {
    "Giáo sư": 1,
    "Phó Giáo sư": 2,
    "Tiến sĩ": 3,
    "Thạc sĩ": 4,
    "Cử nhân": 5,
  };
  
  const positionOrder = {
    "Trưởng khoa": 1,
    "Phó khoa": 2,
    "Thành viên": 3,
  };
  
  return [...lecturers].sort((a, b) => {
    if (a.position !== b.position) {
      return positionOrder[a.position] - positionOrder[b.position];
    }
    return rankOrder[a.academicTitle] - rankOrder[b.academicTitle];
  });
}

// Hàm nhóm giảng viên theo khoa
function groupLecturersByDepartment(lecturers) {
  const departments = {};
  
  lecturers.forEach(lecturer => {
    if (!departments[lecturer.department]) {
      departments[lecturer.department] = [];
    }
    departments[lecturer.department].push(lecturer);
  });
  
  // Sắp xếp giảng viên trong mỗi khoa
  Object.keys(departments).forEach(dept => {
    departments[dept] = sortLecturersByRank(departments[dept]);
  });
  
  return departments;
}

export default function LecturerListPage() {
  const lecturers = useMemo(() => generateLecturers(), []);
  const groupedLecturers = useMemo(() => groupLecturersByDepartment(lecturers), [lecturers]);
  
  // Trạng thái nhập liệu
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterTitle, setFilterTitle] = useState("");

  // Trạng thái áp dụng cho tìm kiếm và bộ lọc
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedDepartment, setAppliedDepartment] = useState("");
  const [appliedTitle, setAppliedTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedDept, setExpandedDept] = useState(null);

  // Khi nhấn nút Tìm kiếm, cập nhật trạng thái áp dụng và reset trang về 1
  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setAppliedStatus(filterStatus);
    setAppliedDepartment(filterDepartment);
    setAppliedTitle(filterTitle);
    setCurrentPage(1);
  };

  // Lọc danh sách giảng viên dựa trên trạng thái đã áp dụng (applied)
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const matchesSearch =
        lecturer.name.toLowerCase().includes(appliedSearch.toLowerCase()) ||
        lecturer.id.toLowerCase().includes(appliedSearch.toLowerCase());
      const matchesStatus = appliedStatus
        ? lecturer.status === appliedStatus
        : true;
      const matchesDepartment = appliedDepartment
        ? lecturer.department === appliedDepartment
        : true;
      const matchesTitle = appliedTitle
        ? lecturer.academicTitle === appliedTitle
        : true;
      return matchesSearch && matchesStatus && matchesDepartment && matchesTitle;
    });
  }, [lecturers, appliedSearch, appliedStatus, appliedDepartment, appliedTitle]);

  const filteredGroupedLecturers = useMemo(() => {
    return groupLecturersByDepartment(filteredLecturers);
  }, [filteredLecturers]);

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
      <Container maxWidth="lg">
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
              disabled={filteredLecturers.length === 0}
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
                    "Chuyên ngành"
                  ],
                  filteredLecturers.map((lecturer) => [
                    lecturer.id,
                    lecturer.name,
                    lecturer.dob,
                    lecturer.department,
                    lecturer.position,
                    lecturer.status,
                    lecturer.academicTitle,
                    lecturer.specialization
                  ])
                )}
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
                    {Object.keys(academicGroups).map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
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
                >
                  Tìm kiếm
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          {/* Hiển thị theo khoa */}
          {Object.keys(filteredGroupedLecturers).length > 0 ? (
            Object.keys(filteredGroupedLecturers).map((dept) => (
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
                    '&.Mui-expanded': {
                      minHeight: '64px',
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Iconify icon="fluent:building-24-regular" width={24} height={24} />
                    <Typography variant="h6">{dept}</Typography>
                    <Chip 
                      label={`${filteredGroupedLecturers[dept].length} giảng viên`} 
                      size="small" 
                      color="primary"
                    />
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {filteredGroupedLecturers[dept].map((lecturer) => (
                      <Grid item xs={12} md={6} key={lecturer.id}>
                        <Card 
                          sx={{ 
                            display: 'flex', 
                            borderRadius: "8px",
                            border: lecturer.position === "Trưởng khoa" 
                              ? '1px solid #1976d2' 
                              : lecturer.position === "Phó khoa" 
                                ? '1px solid #0288d1' 
                                : 'none',
                            boxShadow: lecturer.position !== "Thành viên" ? 3 : 1
                          }}
                        >
                          <Box sx={{ pl: 2, pt: 2, pb: 2 }}>
                            <Avatar 
                              src={lecturer.avatar} 
                              alt={lecturer.name}
                              sx={{ 
                                width: 100, 
                                height: 100,
                                border: '2px solid',
                                borderColor: lecturer.position === "Trưởng khoa" 
                                  ? 'primary.main' 
                                  : lecturer.position === "Phó khoa" 
                                    ? 'info.main' 
                                    : 'grey.300'
                              }}
                            />
                          </Box>
                          <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                            <Stack spacing={1}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {lecturer.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ({lecturer.id})
                                </Typography>
                              </Box>
                              
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={lecturer.academicTitle} 
                                  size="small" 
                                  color={
                                    lecturer.academicTitle === "Giáo sư" ? "error" :
                                    lecturer.academicTitle === "Phó Giáo sư" ? "warning" :
                                    lecturer.academicTitle === "Tiến sĩ" ? "success" : "default"
                                  }
                                  variant="outlined"
                                />
                                {getPositionChip(lecturer.position)}
                                {getStatusChip(lecturer.status)}
                              </Box>
                              
                              <Stack direction="row" spacing={3}>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Sinh nhật:</strong> {lecturer.dob}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Chuyên ngành:</strong> {lecturer.specialization}
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
          ) : (
            <Card sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">Không tìm thấy giảng viên nào phù hợp với tiêu chí tìm kiếm.</Typography>
            </Card>
          )}
        </Box>
      </Container>
    </Page>
  );
}