# English Version Migration Guide

This guide will help you and Claude Code convert the Vietnamese Student Information System to a fully English version with proper naming conventions.

## Vietnamese to English Translation Mapping

### Module Names (Directories)
| Vietnamese | English | Description |
|------------|---------|-------------|
| `SinhVien` | `Student` | Student management |
| `GiangVien` | `Teacher` or `Instructor` | Teacher/instructor management |
| `KhoaHoc` | `Course` | Course management |
| `DiemDanh` | `Attendance` | Attendance tracking |
| `DiemSo` | `Grade` | Grade/score management |
| `BaiKiemTra` | `Exam` or `Test` | Exam/test management |
| `HocPhi` | `Tuition` | Tuition fee management |
| `KyLuat` | `Discipline` | Disciplinary records |
| `PhuHuynh` | `Guardian` or `Parent` | Parent/guardian management |
| `ThongBao` | `Notification` | Notification system |
| `LichHoc` | `ClassSchedule` | Class schedule management |
| `Lich` | `Calendar` | Personal calendar |
| `Khoa` | `Faculty` or `Department` | Faculty/department management |

### Schema Field Names
| Vietnamese | English | Type | Description |
|------------|---------|------|-------------|
| `mssv` | `studentId` | string | Student ID |
| `MaGV` | `instructorId` | string | Instructor ID |
| `HoTen` | `fullName` | string | Full name |
| `NgaySinh` | `dateOfBirth` | Date | Date of birth |
| `GioiTinh` | `gender` | string | Gender |
| `DiaChi` | `address` | string | Address |
| `SoDienThoai` | `phoneNumber` | string | Phone number |
| `CCCD` | `nationalId` | string | National ID/SSN |
| `Anh` | `profileImage` | string | Profile image |
| `TrangThai` | `status` | string | Status |
| `KhoaID` | `facultyId` | ObjectId | Faculty ID |
| `ThongBao` | `notifications` | array | Notifications |
| `ThoiGianCapNhat` | `updatedAt` | Date | Last updated |
| `NgayCapNhat` | `updatedAt` | Date | Last updated |
| `ChucVu` | `position` | string | Position/title |
| `TrinhDo` | `degree` | string | Educational degree |
| `NgayVaoLam` | `hireDate` | Date | Hire date |
| `MaKhoaHoc` | `courseCode` | string | Course code |
| `TenKhoaHoc` | `courseName` | string | Course name |
| `SoTinChi` | `creditHours` | number | Credit hours |
| `MoTa` | `description` | string | Description |
| `SinhVienDangKy` | `enrolledStudents` | array | Enrolled students |
| `TaiLieu` | `documents` | array | Documents |
| `SoLuongToiDa` | `maxCapacity` | number | Maximum capacity |
| `HanDangKy` | `enrollmentDeadline` | Date | Enrollment deadline |
| `NgayBatDau` | `startDate` | Date | Start date |
| `NgayKetThuc` | `endDate` | Date | End date |
| `DanhSachSinhVien` | `studentList` | array | Student list |
| `NgayHoc` | `classDate` | Date | Class date |
| `GhiChu` | `notes` | string | Notes |
| `LoaiDiem` | `gradeType` | string | Grade type |
| `HeSo` | `multiplier` | number | Grade multiplier |
| `Diem` | `score` | number | Score |
| `BaiKiemTraID` | `examId` | ObjectId | Exam ID |
| `DiemThanhPhan` | `componentGrades` | array | Component grades |
| `TenBaiKiemTra` | `examTitle` | string | Exam title |
| `DeThi` | `questions` | array | Exam questions |
| `ThoiGianLam` | `duration` | number | Duration (minutes) |
| `CauHoi` | `question` | string | Question text |
| `DapAn` | `answers` | array | Answer options |
| `DapAnDung` | `correctAnswers` | array | Correct answers |
| `GiaiThich` | `explanation` | string | Explanation |
| `ThoiGianBatDau` | `startTime` | Date | Start time |
| `ThoiGianKetThuc` | `endTime` | Date | End time |
| `TenThongBao` | `title` | string | Notification title |
| `NoiDung` | `content` | string | Content |
| `NhomGui` | `targetGroup` | string | Target group |
| `NgayTao` | `createdAt` | Date | Created date |
| `MaKhoa` | `facultyCode` | string | Faculty code |
| `TenKhoa` | `facultyName` | string | Faculty name |
| `SoSao` | `rating` | number | Star rating |
| `DanhGia` | `review` | string | Review text |
| `ThoiGianDanhGia` | `reviewDate` | Date | Review date |

### Enum Values
| Vietnamese | English |
|------------|---------|
| `'Studying'` | `'enrolled'` |
| `'On hold'` | `'suspended'` |
| `'Graduated'` | `'graduated'` |
| `'Dropped Out'` | `'dropped_out'` |
| `'Present'` | `'present'` |
| `'Absent'` | `'absent'` |
| `'Late'` | `'late'` |

## Project Structure Conversion Steps

### 1. Directory Structure
```
src/
├── auth/                    # Keep as is - already in English
├── student/                 # Renamed from SinhVien
├── instructor/              # Renamed from GiangVien  
├── course/                  # Renamed from KhoaHoc
├── attendance/              # Renamed from DiemDanh
├── grade/                   # Renamed from DiemSo
├── exam/                    # Renamed from BaiKiemTra
├── tuition/                 # Renamed from HocPhi
├── discipline/              # Renamed from KyLuat
├── guardian/                # Renamed from PhuHuynh
├── notification/            # Renamed from ThongBao
├── class-schedule/          # Renamed from LichHoc
├── calendar/                # Renamed from Lich
├── faculty/                 # Renamed from Khoa
├── schemas/
└── upload/                  # Keep as is - already in English
```

### 2. File Naming Convention
- **Controllers**: `{module}.controller.ts` (e.g., `student.controller.ts`)
- **Services**: `{module}.service.ts` (e.g., `student.service.ts`)
- **Modules**: `{module}.module.ts` (e.g., `student.module.ts`)
- **DTOs**: Place in `dto/` subdirectory with descriptive names
- **Schemas**: `{module}.schema.ts` in `schemas/` directory

### 3. Schema Class Names
```typescript
// Instead of: export class SinhVien
export class Student

// Instead of: export class GiangVien  
export class Instructor

// Instead of: export class KhoaHoc
export class Course

// etc.
```

### 4. Module Registration Updates
Update `app.module.ts` imports:
```typescript
// Replace Vietnamese imports with English ones
import { StudentModule } from './student/student.module';
import { InstructorModule } from './instructor/instructor.module';
import { CourseModule } from './course/course.module';
// etc.
```

### 5. Database Connection
- Keep the same MongoDB connection
- Existing data will remain accessible with new field mappings
- Consider data migration scripts if field names need to change

### 6. API Endpoints
Update route decorators to use English paths:
```typescript
// Instead of: @Controller('sinhvien')
@Controller('students')

// Instead of: @Controller('giangvien')
@Controller('instructors')
```

## Development Workflow for English Migration

### Phase 1: Planning
1. Create new project directory structure
2. Set up package.json with same dependencies
3. Copy configuration files (nest-cli.json, tsconfig.json, etc.)

### Phase 2: Schema Migration
1. Create new schema files with English names and field mappings
2. Update field names according to translation table
3. Maintain same data types and validation rules

### Phase 3: Module by Module Conversion
For each Vietnamese module:
1. Create new English module directory
2. Implement controller with English route names
3. Implement service with English method names
4. Create DTOs with English field names
5. Write unit tests with English naming

### Phase 4: Integration
1. Update app.module.ts with new modules
2. Update main.ts if needed
3. Update authentication references
4. Test all endpoints

### Phase 5: Documentation
1. Update Swagger decorators with English descriptions
2. Create new API documentation
3. Update README with English structure

## Claude Code Instructions

When working on the English version:

1. **Always use the translation mapping** provided above
2. **Follow NestJS conventions** with English naming
3. **Use camelCase** for field names (JavaScript/TypeScript convention)
4. **Use PascalCase** for class names
5. **Use kebab-case** for API routes (REST convention)
6. **Maintain same business logic** while translating names
7. **Keep same validation rules** and constraints
8. **Use descriptive English method names** in services
9. **Update all DTOs** with English field names
10. **Maintain database relationships** with new schema names

## Common Patterns to Follow

### Controller Example
```typescript
@Controller('students')
export class StudentController {
  @Get()
  async getAllStudents() { ... }
  
  @Post()
  async createStudent(@Body() createStudentDto: CreateStudentDto) { ... }
  
  @Put(':id')
  async updateStudent(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) { ... }
}
```

### Service Example
```typescript
@Injectable()
export class StudentService {
  async findAllStudents() { ... }
  async createStudent(createStudentDto: CreateStudentDto) { ... }
  async updateStudent(id: string, updateStudentDto: UpdateStudentDto) { ... }
}
```

### Schema Example
```typescript
@Schema()
export class Student {
  @Prop({ unique: true, required: true })
  studentId: string;

  @Prop({ required: true })
  fullName: string;

  @Prop()
  dateOfBirth: Date;

  @Prop({ enum: ['enrolled', 'suspended', 'graduated', 'dropped_out'], default: 'enrolled' })
  status: string;
}
```

This guide ensures consistency and maintainability when creating the English version of the Student Information System.