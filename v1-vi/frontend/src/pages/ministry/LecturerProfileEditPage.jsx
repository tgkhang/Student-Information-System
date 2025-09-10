import React, { useState } from 'react';
import {
  Typography,
  Button,
  Container,
  Box,
  Card,
  Grid,
  Divider,
  Avatar,
  TextField,
  IconButton,
  Stack,
  Chip
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Page from "../../components/Page";
import EditIcon from '@mui/icons-material/Edit';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

// Mock data for demonstration
const LECTURER_DATA = {
  HoTen: "Nguyễn Văn A",
  NgaySinh: new Date("1985-05-15"),
  GioiTinh: "Nam",
  DiaChi: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
  SoDienThoai: "0912345678",
  ChucVu: "Giảng viên chính",
  Khoa: "Công nghệ thông tin",
  CCCD: "079085123456",
  TrinhDo: "Tiến sĩ",
  NgayVaoLam: new Date("2015-09-01"),
  NgayCapNhat: new Date("2023-12-15")
};

export default function LecturerProfile() {
  const [lecturer, setLecturer] = useState(LECTURER_DATA);
  const [isEditing, setIsEditing] = useState(false);
  
  const formatDate = (date) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy', { locale: vi });
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    // Here you would typically save the data to your backend
    setIsEditing(false);
    // Update the NgayCapNhat to current date
    setLecturer({
      ...lecturer,
      NgayCapNhat: new Date()
    });
  };
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setLecturer({
      ...lecturer,
      [name]: value
    });
  };

  return (
    <Page title="Thông tin chi tiết giảng viên">
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" gutterBottom>
              Thông tin chi tiết giảng viên
            </Typography>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={handleEdit}
              >
                Chỉnh sửa
              </Button>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Lưu
                </Button>
              </Stack>
            )}
          </Stack>
        </Box>

        <Card sx={{ p: 3, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { md: 'flex-start' },
              mb: 3
            }}
          >
            <Avatar
              src="/static/mock-images/avatars/teacher-1.jpg"
              alt={lecturer.HoTen}
              sx={{
                width: 120,
                height: 120,
                mb: { xs: 2, md: 0 },
                mr: { md: 4 }
              }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h4" sx={{ mr: 1 }}>
                  {lecturer.HoTen}
                </Typography>
                <Chip
                  icon={<SchoolIcon />}
                  label={lecturer.TrinhDo}
                  color="primary"
                  size="small"
                />
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WorkIcon sx={{ color: 'text.secondary', mr: 1, width: 20, height: 20 }} />
                <Typography variant="body1">
                  {lecturer.ChucVu} - Khoa {lecturer.Khoa}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EventIcon sx={{ color: 'text.secondary', mr: 1, width: 20, height: 20 }} />
                <Typography variant="body2" color="text.secondary">
                  Ngày vào làm: {formatDate(lecturer.NgayVaoLam)}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Thông tin cá nhân
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PersonIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Họ và tên
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="HoTen"
                        value={lecturer.HoTen}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.HoTen}</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <EventIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Ngày sinh
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        type="date"
                        name="NgaySinh"
                        value={lecturer.NgaySinh.toISOString().substr(0, 10)}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{formatDate(lecturer.NgaySinh)}</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PersonIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Giới tính
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="GioiTinh"
                        value={lecturer.GioiTinh}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.GioiTinh}</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <BadgeIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Số CCCD
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="CCCD"
                        value={lecturer.CCCD}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.CCCD}</Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Thông tin liên hệ
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <PhoneIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="SoDienThoai"
                        value={lecturer.SoDienThoai}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.SoDienThoai}</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <HomeIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Địa chỉ
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="DiaChi"
                        value={lecturer.DiaChi}
                        onChange={handleChange}
                        margin="dense"
                        multiline
                        rows={2}
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.DiaChi}</Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
              
              <Typography variant="subtitle1" sx={{ mb: 2, mt: 3 }}>
                Thông tin chuyên môn
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <WorkIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Chức vụ
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="ChucVu"
                        value={lecturer.ChucVu}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.ChucVu}</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <SchoolIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Khoa
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="Khoa"
                        value={lecturer.Khoa}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.Khoa}</Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <SchoolIcon sx={{ color: 'text.secondary', mr: 1, mt: 0.5, width: 20, height: 20 }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Trình độ
                    </Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="small"
                        name="TrinhDo"
                        value={lecturer.TrinhDo}
                        onChange={handleChange}
                        margin="dense"
                      />
                    ) : (
                      <Typography variant="body1">{lecturer.TrinhDo}</Typography>
                    )}
                  </Box>
                </Box>
              </Stack>
            </Grid>
          </Grid>
          
          <Divider sx={{ my: 3 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Cập nhật lần cuối: {formatDate(lecturer.NgayCapNhat)}
            </Typography>
            
            <Button
              component={RouterLink}
              to="/dashboard/lecturers"
              color="inherit"
            >
              Quay lại danh sách
            </Button>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}