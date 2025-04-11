import {
  Dashboard,
  MenuBook,
  AccountCircle,
  Home,
  Info,
  School,
  Event,
  Assignment,
  Payments,
  CalendarToday,
  Group,
  Notifications,
  AddCircle,
  UploadFile,
  PersonAdd,
} from '@mui/icons-material';


const navTeacherConfig = [
  { title: 'My Profile', path: '/teacher/dashboard', icon: <AccountCircle /> },
  { title: 'My Courses', path: '/teacher/course', icon: <MenuBook /> },
  { title: 'Course Reviews', path: '/teacher/review', icon: <Info /> },
];

const navStudentConfig = [
  { title: 'Dashboard', path: '/student/dashboard', icon: <Dashboard /> },
  { title: 'My Courses', path: '/student/course', icon: <School /> },
  { title: 'My Schedule', path: '/student/schedule', icon: <Event /> },
  { title: 'Class Registration', path: '/student/registration', icon: <Assignment /> },
  { title: 'Calendar View', path: '/student/calendar', icon: <CalendarToday /> },
];

const navAdminConfig = [
  { title: 'Student List', path: '/admin/studentList', icon: <Group /> },
  { title: 'Lecturer List', path: '/admin/lecturerList', icon: <AccountCircle /> },
  { title: 'All Courses', path: '/admin/course', icon: <MenuBook /> },
  { title: 'Notifications', path: '/admin/notification', icon: <Notifications /> },
  { title: 'Create Notification', path: '/admin/createBroadcastNotification', icon: <AddCircle /> },
  { title: 'Add New Course', path: '/admin/addCourse', icon: <AddCircle /> },
  { title: 'Import Students', path: '/admin/addStudent', icon: <UploadFile /> },
  { title: 'Import Teachers', path: '/admin/addTeacher', icon: <PersonAdd /> },
];

export { navTeacherConfig, navStudentConfig, navAdminConfig };
