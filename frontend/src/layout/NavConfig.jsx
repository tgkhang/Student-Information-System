import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import SchoolIcon from '@mui/icons-material/School';


const navTeacherConfig = [
    { title: 'profile', path: '/profile', icon: <AccountCircleIcon /> },
    { title: 'home', path: '/', icon: <HomeIcon /> },
    { title: 'about', path: '/about', icon: <InfoIcon /> },
  ];

const navStudentConfig = [
    { title: 'contact', path: '/contact', icon: <ForumIcon /> },
    { title: 'services', path: '/services', icon: <SchoolIcon /> }
]

const navAdminConfig = [
    { title: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { title: 'courses', path: '/courses', icon: <MenuBookIcon /> },
]

export { navTeacherConfig, navStudentConfig, navAdminConfig };