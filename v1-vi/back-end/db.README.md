# Database Schema Documentation

This document describes the MongoDB collections (tables) used in the Student Information System.

## Collections Overview

The database consists of 16 main collections that manage various aspects of the educational system:

### 1. User Collection
**Collection Name:** `users`
**Purpose:** Authentication and user management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | Unique email address |
| username | String | Yes | Unique username |
| password | String | Yes | Hashed password |
| accessToken | String | No | JWT access token |
| refreshToken | String | No | JWT refresh token |
| resetToken | String | No | Password reset token |
| role | String | No | User role: 'student', 'teacher', 'admin' (default: 'student') |

### 2. SinhVien Collection (Students)
**Collection Name:** `sinhviens`
**Purpose:** Student information management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| mssv | String | Yes | Unique student ID |
| HoTen | String | Yes | Full name |
| NgaySinh | Date | No | Date of birth |
| GioiTinh | String | No | Gender |
| DiaChi | String | No | Address |
| SoDienThoai | String | No | Phone number |
| Khoa | String | No | Faculty name |
| CCCD | String | No | Citizen ID |
| Anh | String | No | Profile picture URL |
| TrangThai | String | No | Status: 'Studying', 'On hold', 'Graduated', 'Dropped Out' |
| KhoaID | ObjectId | No | Reference to Khoa collection |
| ThongBao | Array | No | Array of notification objects with read status |
| ThoiGianCapNhat | Date | No | Last update time |

### 3. GiangVien Collection (Teachers)
**Collection Name:** `giangviens`
**Purpose:** Teacher information management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| MaGV | String | Yes | Teacher ID |
| HoTen | String | Yes | Full name |
| NgaySinh | Date | No | Date of birth |
| GioiTinh | String | No | Gender |
| Anh | String | No | Profile picture URL |
| DiaChi | String | No | Address |
| SoDienThoai | String | No | Phone number |
| ChucVu | String | No | Position |
| Khoa | String | No | Faculty name |
| CCCD | String | No | Citizen ID |
| TrinhDo | String | No | Education level |
| NgayVaoLam | Date | No | Employment start date |
| ThongBao | Array | No | Array of notification objects with read status |
| NgayCapNhat | Date | No | Last update time |
| KhoaID | ObjectId | No | Reference to Khoa collection |

### 4. Khoa Collection (Faculties)
**Collection Name:** `khoas`
**Purpose:** Faculty/department management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| MaKhoa | String | Yes | Unique faculty code |
| TenKhoa | String | Yes | Unique faculty name |

### 5. KhoaHoc Collection (Courses)
**Collection Name:** `khoahocs`
**Purpose:** Course management with assignments and materials

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| MaKhoaHoc | String | Yes | Unique course code |
| TenKhoaHoc | String | Yes | Unique course name |
| GiangVienID | Array[ObjectId] | No | Array of teacher references |
| SoTinChi | Number | Yes | Number of credits |
| MoTa | String | No | Course description |
| SinhVienDangKy | Array[ObjectId] | No | Array of enrolled student references |
| Deadlines | Array[Deadline] | No | Course assignments with submissions |
| TaiLieu | Array[ObjectId] | No | Course materials references |
| NgayCapNhat | Date | No | Last update time |
| SoLuongToiDa | Number | Yes | Maximum enrollment capacity |
| SoLuongSinhVienDangKy | Number | No | Current enrollment count |
| HanDangKy | Date | Yes | Registration deadline |
| NgayBatDau | Date | Yes | Course start date |
| NgayKetThuc | Date | Yes | Course end date |
| KhoaID | ObjectId | Yes | Reference to Khoa collection |

**Embedded Documents:**
- **Deadline:** Contains assignment details, start/end dates, and student submissions
- **Submission:** Links student to submitted materials

### 6. DiemDanh Collection (Attendance)
**Collection Name:** `diemdanhs`
**Purpose:** Class attendance tracking

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| DanhSachSinhVien | Array[SinhVienStatus] | Yes | Student attendance status list |
| KhoaHocID | ObjectId | Yes | Reference to KhoaHoc collection |
| NgayHoc | Date | No | Class date |
| GhiChu | String | No | Additional notes |
| NgayCapNhat | Date | No | Last update time |

**Embedded Documents:**
- **SinhVienStatus:** Student attendance status ('Present', 'Absent', 'Late')

### 7. DiemSo Collection (Grades)
**Collection Name:** `diemsos`
**Purpose:** Student grade management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| SinhVienID | ObjectId | Yes | Reference to SinhVien collection |
| KhoaHocID | ObjectId | Yes | Reference to KhoaHoc collection |
| DiemThanhPhan | Array[DiemThanhPhan] | No | Component grades array |

**Embedded Documents:**
- **DiemThanhPhan:** Grade components with type, coefficient, score, and exam attempt tracking

### 8. BaiKiemTra Collection (Exams/Tests)
**Collection Name:** `baikiemtras`
**Purpose:** Test and exam management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| TenBaiKiemTra | String | Yes | Test name |
| MoTa | String | No | Test description |
| KhoaHocID | ObjectId | No | Reference to KhoaHoc collection |
| DeThi | Array[DeThi] | No | Test questions |
| ThoiGianLam | Number | No | Time limit in minutes |
| DanhGia | DanhGia | No | Test evaluation |
| ThoiGianBatDau | Date | No | Test start time |
| ThoiGianKetThuc | Date | No | Test end time |

**Embedded Documents:**
- **DeThi:** Test questions with answers and explanations
- **DanhGia:** Test evaluation details

### 9. HocPhi Collection (Tuition)
**Collection Name:** `hocphis`
**Purpose:** Tuition fee management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| SinhVienID | ObjectId | Yes | Reference to SinhVien collection |
| KhoaHocID | ObjectId | No | Reference to KhoaHoc collection |
| HocKy | Number | No | Semester number |
| NamHoc | Date | No | Academic year |
| NoiDung | String | No | Payment description |
| SoTienCanDong | Number | No | Amount due |
| TrangThaiThanhToan | String | No | Payment status: 'Paid', 'Unpaid', 'Extended' |
| HanDongHocPhi | Date | No | Payment deadline |
| GiaHanHocPhi | GiaHanHocPhi | No | Payment extension details |
| NgayTao | Date | No | Creation date |

**Embedded Documents:**
- **GiaHanHocPhi:** Payment extension information

### 10. ThongBaos Collection (Notifications)
**Collection Name:** `thongbaos`
**Purpose:** System-wide notification management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| TenThongBao | String | Yes | Notification title |
| NoiDung | String | Yes | Notification content |
| NhomGui | String | Yes | Target group: 'GiangVien', 'SinhVien', 'Khoa', 'KhoaHoc', 'NienKhoa' |
| KhoaID | ObjectId | No | Reference to Khoa collection (if applicable) |
| KhoaHocID | ObjectId | No | Reference to KhoaHoc collection (if applicable) |
| NgayTao | Date | No | Creation date |

### 11. LichHoc Collection (Class Schedule)
**Collection Name:** `lichhocs`
**Purpose:** Class scheduling

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| KhoaHocID | ObjectId | Yes | Reference to KhoaHoc collection |
| GiangVienID | ObjectId | No | Reference to GiangVien collection |
| NgayHoc | Number | No | Day of week (0-6) |
| ThoiGianBatDau | String | No | Start time |
| ThoiGianKetThuc | String | No | End time |
| DiaDiem | String | No | Classroom/location |
| NgayCapNhat | Date | No | Last update time |

### 12. Lich Collection (Personal Calendar)
**Collection Name:** `lichs`
**Purpose:** Student personal calendar and notes

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| SinhVienID | ObjectId | Yes | Reference to SinhVien collection |
| GhiChu | Array[GhiChu] | No | Personal notes array |

**Embedded Documents:**
- **GhiChu:** Personal notes with content and creation time

### 13. KyLuat Collection (Discipline Records)
**Collection Name:** `kyluats`
**Purpose:** Student discipline record management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| SinhVienID | ObjectId | Yes | Reference to SinhVien collection |
| NoiDung | String | Yes | Violation description |
| NgayLap | Date | No | Record creation date |
| TrangThai | String | No | Status: 'Processing', 'Processed' |
| HinhThucXuLy | String | No | Punishment type |
| NgayCapNhat | Date | No | Last update time |

### 14. PhuHuynh Collection (Parents/Guardians)
**Collection Name:** `phuhuynhs`
**Purpose:** Parent/guardian information and communication

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| SinhVienID | ObjectId | Yes | Unique reference to SinhVien collection |
| HoTen | String | Yes | Full name |
| Email | String | No | Email address |
| SoDienThoai | String | No | Phone number |
| MoiQuanHe | String | Yes | Relationship to student |
| DiaChi | String | No | Address |
| ThongBao | Array[ThongBao] | No | Discipline-related notifications |

**Embedded Documents:**
- **ThongBao:** Notifications about discipline records

### 15. TaiLieu Collection (Documents/Materials)
**Collection Name:** `tailieux`
**Purpose:** Course materials and document management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| TenTaiLieu | String | Yes | Document name |
| LinkTaiLieu | String | Yes | Document URL/path |
| MoTa | String | Yes | Document description |
| NguoiDang | String | Yes | Uploader name |
| NgayTao | Date | No | Upload date |

### 16. DanhGiaKhoaHoc Collection (Course Ratings)
**Collection Name:** `danhgiakhoahocs`
**Purpose:** Student course evaluation and ratings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| KhoaHocID | ObjectId | Yes | Reference to KhoaHoc collection |
| mssv | ObjectId | Yes | Reference to SinhVien collection |
| SoSao | Number | Yes | Rating (0-5 stars) |
| DanhGia | String | No | Written review |
| ThoiGianDanhGia | Date | No | Rating submission time |

## Relationships

### Primary Relationships:
- **User ↔ SinhVien/GiangVien:** Authentication linked to student/teacher profiles
- **Khoa → SinhVien/GiangVien:** Faculty contains students and teachers
- **KhoaHoc ↔ SinhVien:** Many-to-many enrollment relationship
- **KhoaHoc ↔ GiangVien:** Many-to-many teaching relationship
- **SinhVien → DiemSo/DiemDanh/HocPhi:** Student academic records
- **KhoaHoc → BaiKiemTra/LichHoc:** Course content and schedule
- **SinhVien ↔ PhuHuynh:** One-to-one parent relationship
- **SinhVien → KyLuat:** Student discipline records

### Reference Patterns:
- Most collections use MongoDB ObjectId references
- Notifications use embedded arrays for read/unread tracking
- Course deadlines and submissions use embedded document patterns
- Grade components stored as embedded arrays for flexibility

## Indexing Recommendations

### Unique Indexes:
- `users.email`, `users.username`
- `sinhviens.mssv`
- `khoas.MaKhoa`, `khoas.TenKhoa`
- `khoahocs.MaKhoaHoc`, `khoahocs.TenKhoaHoc`
- `phuhuynhs.SinhVienID`

### Query Optimization Indexes:
- `sinhviens.KhoaID`
- `giangviens.KhoaID`
- `khoahocs.KhoaID`
- `diemsos.SinhVienID`, `diemsos.KhoaHocID`
- `diemdanhs.KhoaHocID`
- `hocphis.SinhVienID`
- `kyluats.SinhVienID`
- `lichhocs.KhoaHocID`, `lichhocs.GiangVienID`
- `danhgiakhoahocs.KhoaHocID`, `danhgiakhoahocs.mssv`