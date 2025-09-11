# InfoStudia Student Information System

## Introduction

InfoStudia Student Information System is a comprehensive educational management platform designed with a user-friendly interface that provides familiar functionalities while introducing new features to overcome existing limitations. The system aims to streamline the management of student information, course registration, academic progress tracking, and communication between students, faculty, and administrative staff.

## Repository Structure

This repository contains two versions of the InfoStudia system:

### Version 2 (v2/) - **In Development**
- **Status**: Active development version with experimental features
- **Backend**: NestJS + Prisma ORM + MongoDB
- **Database**: Modern Prisma schema with comprehensive educational models
- **Authentication**: Enhanced JWT system with refresh tokens
- **Features**: Improved architecture, better type safety, comprehensive seeding

### Version 1 (v1-vi/) - **Stable Version**
- **Status**: Production-ready version with Vietnamese naming conventions
- **Backend**: NestJS + Mongoose + MongoDB  
- **Frontend**: React + Vite + Material-UI
- **Database**: Traditional Mongoose schemas
- **Features**: Complete implementation with Azure storage integration

The platform offers a range of features including:

- Student information and academic record management
- Course and curriculum management
- Online attendance tracking with parent notifications
- Test and examination administration
- Academic calendar and scheduling
- Role-based access control
- Notification system for exams, events, and regulations
- Document sharing and course announcements
- Course registration and timetable display
- Course evaluation system
- Detailed reporting and data analysis
- Online fee payment with email notifications

## User Roles

The system supports the following user roles:

1. **Guest** - Can access public pages without login (system introduction, general announcements)
2. **Student** - Can manage personal information, register for courses, view academic records, participate in exams, and evaluate courses
3. **Instructor** - Can manage course materials, create assessments, grade assignments, and track student attendance
4. **Administrative Staff** - Can organize courses, schedule classes, assign instructors, monitor student progress, and handle academic issues

## Technology Stack

### Version 2 (v2/) - In Development
#### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: JWT with Passport.js (access + refresh tokens)
- **Validation**: class-validator with class-transformer
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest with comprehensive coverage

### Version 1 (v1-vi/) - Stable
#### Frontend
- **Framework**: ReactJS with Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Yup validation

#### Backend
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Azure Blob Storage
- **Image Storage**: Cloudinary
- **API Documentation**: Swagger

## Project Structure

### Version 2 (v2/) - Development Structure
```
v2/
└── backend/
    ├── src/
    │   ├── main.ts              # Application bootstrap
    │   ├── app.module.ts        # Main application module
    │   ├── prisma/              # Prisma service and configuration
    │   ├── auth/                # JWT authentication system
    │   │   ├── guards/          # JWT, Local, and Roles guards
    │   │   ├── strategies/      # Passport strategies
    │   │   └── decorators/      # @Public and @Roles decorators
    │   ├── users/               # User management
    │   ├── students/            # Student profiles
    │   ├── teachers/            # Teacher profiles
    │   ├── courses/             # Course management
    │   ├── grades/              # Grade/scoring system
    │   ├── attendances/         # Attendance tracking
    │   ├── faculties/           # Department management
    │   ├── notifications/       # System notifications
    │   └── [other modules...]   # Additional educational modules
    ├── prisma/
    │   ├── schema.prisma        # Database schema
    │   └── seed.ts              # Database seeding
    └── test/                    # Testing files
```

### Version 1 (v1-vi/) - Stable Structure
```
v1-vi/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main application entry point
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components
│   │   ├── sections/            # Large page sections
│   │   ├── contexts/            # React context providers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── routes/              # Routing configuration
│   │   ├── guards/              # Route protection
│   │   ├── utils/               # Utility functions
│   │   ├── assets/              # Static assets
│   │   └── theme/               # MUI theme configuration
│   └── package.json
└── back-end/
    ├── src/
    │   ├── main.ts              # Entry point
    │   ├── app.module.ts        # Root module
    │   ├── schemas/             # Mongoose schemas
    │   ├── auth/                # Authentication with mailer
    │   ├── SinhVien/            # Student management (Vietnamese)
    │   ├── GiangVien/           # Teacher management
    │   ├── KhoaHoc/             # Course management
    │   ├── DiemDanh/            # Attendance
    │   ├── DiemSo/              # Grades/scores
    │   ├── BaiKiemTra/          # Tests/exams
    │   ├── HocPhi/              # Tuition management
    │   ├── ThongBao/            # Notifications
    │   ├── LichHoc/             # Scheduling
    │   └── upload/              # File upload handling
    └── test/                    # Testing files
```

## Installation and Setup

### Prerequisites
- Node.js (v14.x or higher)
- npm or yarn
- MongoDB
- Docker (recommended for V2)

## Version 2 Setup (Development)

### Backend Setup (V2)

1. Clone the repository:
```bash
git clone https://github.com/Nhannguyenus24/Student-Information-System.git
cd Student-Information-System/v2/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up MongoDB with Docker:
```bash
docker-compose up -d
```

4. Create a `.env` file:
```env
DATABASE_URL=mongodb://admin:password123@localhost:27017/student_info_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

5. Initialize database:
```bash
npm run prisma:generate
npm run prisma:push
npm run seed
```

6. Start the development server:
```bash
npm run start:dev
```

**Default Accounts (V2):**
- Admin: `admin@university.edu` / `admin123`
- Teacher: `teacher@university.edu` / `admin123`  
- Student: `student@university.edu` / `admin123`

## Version 1 Setup (Stable)

### Frontend Setup (V1)

1. Navigate to the frontend directory:
```bash
cd Student-Information-System/v1-vi/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Setup (V1)

1. Navigate to the backend directory:
```bash
cd ../back-end
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional for Azure storage):
```env
AZURE_STORAGE_CONNECTION_STRING=
AZURE_CONTAINER_NAME=
```

4. Start the development server:
```bash
npm run start:dev
```

**API Documentation:**
- V2: `http://localhost:3000/api/docs`
- V1: `http://localhost:3000/api/docs`

## Development Commands

### Version 2 (Development)
```bash
cd v2/backend

# Development
npm run start:dev          # Start with hot reload
npm run build             # Build application
npm run lint              # Run ESLint with auto-fix
npm run format            # Format code with Prettier

# Testing
npm test                  # Run unit tests
npm run test:e2e          # Run end-to-end tests
npm run test:cov          # Test coverage

# Database
npm run prisma:generate   # Generate Prisma client
npm run prisma:push       # Push schema to database
npm run prisma:studio     # Open Prisma Studio
npm run db:reset          # Reset database and seed
```

### Version 1 (Stable)
```bash
# Frontend (v1-vi/frontend)
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run lint             # Run ESLint

# Backend (v1-vi/back-end)
npm run start:dev        # Start with hot reload
npm run build           # Build application
npm run test            # Run tests
```

## API Documentation

Both versions provide Swagger documentation at `http://localhost:3000/api/docs` when the backend server is running. This interface provides a comprehensive view of all available endpoints, request parameters, and response formats.

## Deployment

### Version 2 Deployment
```bash
cd v2/backend
npm run build            # Compile TypeScript
npm run start:prod       # Start production server
```

### Version 1 Deployment
```bash
# Frontend
cd v1-vi/frontend
npm run build            # Build artifacts to dist/

# Backend  
cd ../back-end
npm run build            # Compile to dist/
npm run start:prod       # Start production server
```

## Contributing

**Version 2 (v2/) is currently in development with experimental features. Use Version 1 (v1-vi/) for stable production deployments.**

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Use Version 1 (v1-vi/) for production-ready features
- Version 2 (v2/) for experimental development and testing new architecture
- Follow existing code patterns and conventions in each version
- Add proper TypeScript types and validation
- Include appropriate tests for new functionality
- Update documentation as needed

## Version Migration

If migrating from V1 to V2:
- V2 uses Prisma instead of Mongoose
- Enhanced authentication with refresh tokens
- Improved TypeScript integration
- Better testing infrastructure
- Refer to `CLAUDE.md` for detailed migration guidance

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors and stakeholders involved in the development of InfoStudia Student Information System.
- Vietnamese educational system requirements consultation
- Modern web development best practices implementation
