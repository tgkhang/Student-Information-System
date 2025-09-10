import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Container,
  Box,
  Grid,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent
} from "@mui/material";
import { Edit, Save, Cancel, School, AssignmentTurnedIn, Gavel } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Page from "../../components/Page";
import * as Yup from "yup";
import { useFormik } from "formik";

// Mock data for demonstration
const mockStudentData = {
  _id: "60d21b4667d0d8992e610c85",
  HoTen: "Nguyễn Văn A",
  NgaySinh: "2000-05-15",
  GioiTinh: "Nam",
  DiaChi: "Số 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  SoDienThoai: "0901234567",
  Khoa: "Công nghệ thông tin",
  CCCD: "079201004321",
  Anh: "https://via.placeholder.com/150",
  TrangThai: "đang học",
  ThoiGianCapNhat: "2023-03-10"
};

const mockDiemData = [
  {
    KhoaHoc: "Lập trình Web",
    LoaiDiem: "Giữa kỳ",
    HeSo: 0.3,
    Diem: 8.5,
    TinChi: 3
  },
  {
    KhoaHoc: "Lập trình Web",
    LoaiDiem: "Cuối kỳ",
    HeSo: 0.7,
    Diem: 7.5,
    TinChi: 3
  },
  {
    KhoaHoc: "Cơ sở dữ liệu",
    LoaiDiem: "Giữa kỳ",
    HeSo: 0.4,
    Diem: 9.0,
    TinChi: 4
  },
  {
    KhoaHoc: "Cơ sở dữ liệu",
    LoaiDiem: "Cuối kỳ",
    HeSo: 0.6,
    Diem: 8.0,
    TinChi: 4
  },
  {
    KhoaHoc: "Toán rời rạc",
    LoaiDiem: "Giữa kỳ",
    HeSo: 0.4,
    Diem: 7.0,
    TinChi: 3
  },
  {
    KhoaHoc: "Toán rời rạc",
    LoaiDiem: "Cuối kỳ",
    HeSo: 0.6,
    Diem: 6.5,
    TinChi: 3
  },
  {
    KhoaHoc: "Mạng máy tính",
    LoaiDiem: "Giữa kỳ",
    HeSo: 0.3,
    Diem: 8.0,
    TinChi: 3
  },
  {
    KhoaHoc: "Mạng máy tính",
    LoaiDiem: "Cuối kỳ",
    HeSo: 0.7,
    Diem: 7.0,
    TinChi: 3
  }
];

const mockKyLuatData = [
  {
    _id: "60d21c4667d0d8992e610c86",
    NoiDung: "Vắng học quá số buổi quy định",
    NgayLap: "2023-02-15",
    TrangThai: "đã xử lý",
    HinhThucXuLy: "Cảnh cáo",
    NgayCapNhat: "2023-02-20"
  },
  {
    _id: "60d21c4667d0d8992e610c87",
    NoiDung: "Nộp bài trễ hạn",
    NgayLap: "2023-01-10",
    TrangThai: "đã xử lý",
    HinhThucXuLy: "Nhắc nhở",
    NgayCapNhat: "2023-01-15"
  }
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function StudentProfile() {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const trangThaiOptions = [
    "đang học",
    "bảo lưu",
    "tốt nghiệp",
    "nghỉ học"
  ];

  const gioiTinhOptions = ["Nam", "Nữ", "Khác"];

  const validationSchema = Yup.object({
    HoTen: Yup.string()
      .required("Họ tên không được để trống"),
    NgaySinh: Yup.date()
      .required("Ngày sinh không được để trống"),
    GioiTinh: Yup.string()
      .required("Giới tính không được để trống"),
    DiaChi: Yup.string()
      .required("Địa chỉ không được để trống"),
    SoDienThoai: Yup.string()
      .matches(/^[0-9]{10}$/, "Số điện thoại không hợp lệ")
      .required("Số điện thoại không được để trống"),
    Khoa: Yup.string()
      .required("Khoa không được để trống"),
    CCCD: Yup.string()
      .matches(/^[0-9]{12}$/, "CCCD không hợp lệ")
      .required("CCCD không được để trống"),
    TrangThai: Yup.string()
      .required("Trạng thái không được để trống")
  });

  const formik = useFormik({
    initialValues: mockStudentData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        console.log("Form submitted:", values);
        setIsEditing(false);
        setIsLoading(false);
        setNotification({
          open: true,
          message: "Cập nhật thông tin thành công!",
          severity: "success"
        });
      }, 1000);
    }
  });

  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  const calculateFinalGrade = (courseGrades) => {
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    courseGrades.forEach(grade => {
      totalWeightedScore += grade.Diem * grade.HeSo;
      totalWeight += grade.HeSo;
    });
    
    return (totalWeightedScore / totalWeight).toFixed(2);
  };

  // Convert 10-scale grade to 4-scale GPA
  const convertTo4Scale = (grade10) => {
    if (grade10 >= 9.0) return 4.0;
    if (grade10 >= 8.5) return 3.7;
    if (grade10 >= 8.0) return 3.5;
    if (grade10 >= 7.5) return 3.3;
    if (grade10 >= 7.0) return 3.0;
    if (grade10 >= 6.5) return 2.7;
    if (grade10 >= 6.0) return 2.5;
    if (grade10 >= 5.5) return 2.3;
    if (grade10 >= 5.0) return 2.0;
    if (grade10 >= 4.0) return 1.0;
    return 0.0;
  };

  // Calculate overall GPA
  const calculateGPA = () => {
    // Group grades by course
    const groupedGrades = mockDiemData.reduce((acc, grade) => {
      if (!acc[grade.KhoaHoc]) {
        acc[grade.KhoaHoc] = {
          grades: [],
          tinChi: grade.TinChi
        };
      }
      acc[grade.KhoaHoc].grades.push(grade);
      return acc;
    }, {});

    let totalWeightedGPA = 0;
    let totalCredits = 0;

    // Calculate final grade for each course and convert to 4.0 scale
    Object.values(groupedGrades).forEach(course => {
      const finalGrade10 = parseFloat(calculateFinalGrade(course.grades));
      const finalGrade4 = convertTo4Scale(finalGrade10);
      totalWeightedGPA += finalGrade4 * course.tinChi;
      totalCredits += course.tinChi;
    });

    return {
      gpa: (totalWeightedGPA / totalCredits).toFixed(2),
      totalCourses: Object.keys(groupedGrades).length,
      totalCredits: totalCredits
    };
  };

  const gpaInfo = calculateGPA();

  // Group grades by course
  const groupedGrades = mockDiemData.reduce((acc, grade) => {
    if (!acc[grade.KhoaHoc]) {
      acc[grade.KhoaHoc] = [];
    }
    acc[grade.KhoaHoc].push(grade);
    return acc;
  }, {});

  // Get letter grade from 4-scale GPA
  const getLetterGrade = (gpa) => {
    if (gpa >= 4.0) return 'A+';
    if (gpa >= 3.7) return 'A';
    if (gpa >= 3.5) return 'B+';
    if (gpa >= 3.0) return 'B';
    if (gpa >= 2.7) return 'C+';
    if (gpa >= 2.3) return 'C';
    if (gpa >= 2.0) return 'D+';
    if (gpa >= 1.0) return 'D';
    return 'F';
  };

  return (
    <Page title="Hồ Sơ Sinh Viên">
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Hồ Sơ Sinh Viên
          </Typography>
          <Divider />
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="student profile tabs"
          >
            <Tab label="Thông Tin Cá Nhân" icon={<School />} iconPosition="start" />
            <Tab label="Kết Quả Học Tập" icon={<AssignmentTurnedIn />} iconPosition="start" />
            <Tab label="Kỷ Luật" icon={<Gavel />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <Typography variant="h5">Thông Tin Cá Nhân</Typography>
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                >
                  Chỉnh Sửa
                </Button>
              ) : (
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    sx={{ mr: 1 }}
                    onClick={formik.handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? <CircularProgress size={24} /> : "Lưu"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    onClick={() => {
                      formik.resetForm();
                      setIsEditing(false);
                    }}
                    disabled={isLoading}
                  >
                    Hủy
                  </Button>
                </Box>
              )}
            </Box>

            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Avatar
                    src={mockStudentData.Anh}
                    alt={mockStudentData.HoTen}
                    sx={{ width: 150, height: 150, mb: 2 }}
                  />
                  {isEditing && (
                    <Button
                      variant="outlined"
                      component="label"
                      size="small"
                    >
                      Cập nhật ảnh
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                      />
                    </Button>
                  )}
                </Grid>

                <Grid item xs={12} md={9}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Họ và tên"
                        name="HoTen"
                        value={formik.values.HoTen}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.HoTen && Boolean(formik.errors.HoTen)}
                        helperText={formik.touched.HoTen && formik.errors.HoTen}
                        disabled={!isEditing}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Ngày sinh"
                        name="NgaySinh"
                        type="date"
                        value={formik.values.NgaySinh}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.NgaySinh && Boolean(formik.errors.NgaySinh)}
                        helperText={formik.touched.NgaySinh && formik.errors.NgaySinh}
                        disabled={!isEditing}
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="gioitinh-label">Giới tính</InputLabel>
                        <Select
                          labelId="gioitinh-label"
                          name="GioiTinh"
                          value={formik.values.GioiTinh}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.GioiTinh && Boolean(formik.errors.GioiTinh)}
                          disabled={!isEditing}
                          label="Giới tính"
                        >
                          {gioiTinhOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Số điện thoại"
                        name="SoDienThoai"
                        value={formik.values.SoDienThoai}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.SoDienThoai && Boolean(formik.errors.SoDienThoai)}
                        helperText={formik.touched.SoDienThoai && formik.errors.SoDienThoai}
                        disabled={!isEditing}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Địa chỉ"
                        name="DiaChi"
                        value={formik.values.DiaChi}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.DiaChi && Boolean(formik.errors.DiaChi)}
                        helperText={formik.touched.DiaChi && formik.errors.DiaChi}
                        disabled={!isEditing}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Khoa"
                        name="Khoa"
                        value={formik.values.Khoa}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.Khoa && Boolean(formik.errors.Khoa)}
                        helperText={formik.touched.Khoa && formik.errors.Khoa}
                        disabled={!isEditing}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="CCCD"
                        name="CCCD"
                        value={formik.values.CCCD}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.CCCD && Boolean(formik.errors.CCCD)}
                        helperText={formik.touched.CCCD && formik.errors.CCCD}
                        disabled={!isEditing}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel id="trangthai-label">Trạng thái</InputLabel>
                        <Select
                          labelId="trangthai-label"
                          name="TrangThai"
                          value={formik.values.TrangThai}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={formik.touched.TrangThai && Boolean(formik.errors.TrangThai)}
                          disabled={!isEditing}
                          label="Trạng thái"
                        >
                          {trangThaiOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Thời gian cập nhật"
                        value={new Date(mockStudentData.ThoiGianCapNhat).toLocaleDateString("vi-VN")}
                        disabled
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Kết Quả Học Tập
            </Typography>
            
            {/* GPA Summary Card */}
            <Card sx={{ mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                      GPA (Hệ 4):
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                      {gpaInfo.gpa} 
                      <Typography variant="h6" component="span" sx={{ ml: 1 }}>
                        ({getLetterGrade(gpaInfo.gpa)})
                      </Typography>
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle1">Tổng số môn:</Typography>
                    <Typography variant="h6">{gpaInfo.totalCourses}</Typography>
                  </Grid>
                  <Grid item xs={6} md={4}>
                    <Typography variant="subtitle1">Tổng số tín chỉ:</Typography>
                    <Typography variant="h6">{gpaInfo.totalCredits}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {Object.entries(groupedGrades).map(([courseName, grades]) => {
              const finalGrade10 = parseFloat(calculateFinalGrade(grades));
              const finalGrade4 = convertTo4Scale(finalGrade10);
              const letterGrade = getLetterGrade(finalGrade4);
              
              return (
                <Box key={courseName} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {courseName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body1">
                        Tín chỉ: <strong>{grades[0].TinChi}</strong>
                      </Typography>
                      <Typography variant="body1">
                        Điểm TB: <strong>{finalGrade10}</strong> / 10
                      </Typography>
                      <Typography variant="body1">
                        GPA: <strong>{finalGrade4}</strong> ({letterGrade})
                      </Typography>
                    </Box>
                  </Box>
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Loại Điểm</TableCell>
                          <TableCell align="right">Hệ Số</TableCell>
                          <TableCell align="right">Điểm</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {grades.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {row.LoaiDiem}
                            </TableCell>
                            <TableCell align="right">{row.HeSo}</TableCell>
                            <TableCell align="right">{row.Diem}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              );
            })}
          </Paper>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Kỷ Luật
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nội Dung</TableCell>
                    <TableCell>Hình Thức Xử Lý</TableCell>
                    <TableCell>Ngày Lập</TableCell>
                    <TableCell>Trạng Thái</TableCell>
                    <TableCell>Ngày Cập Nhật</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockKyLuatData.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.NoiDung}</TableCell>
                      <TableCell>{row.HinhThucXuLy}</TableCell>
                      <TableCell>{new Date(row.NgayLap).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            backgroundColor:
                              row.TrangThai === "đã xử lý" ? "success.light" : "warning.light",
                            color:
                              row.TrangThai === "đã xử lý" ? "success.dark" : "warning.dark",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block"
                          }}
                        >
                          {row.TrangThai}
                        </Box>
                      </TableCell>
                      <TableCell>{new Date(row.NgayCapNhat).toLocaleDateString("vi-VN")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </TabPanel>
      </Container>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Page>
  );
}