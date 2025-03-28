import React from 'react';
import { Box, Typography, Chip, Card, CardContent, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import ClassIcon from '@mui/icons-material/Class';

// CourseCard component: display individual course information
const CourseCard = ({ course }) => {
  return (
    <Card 
      sx={{ 
        mb: 2, 
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', 
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* Course ID and Name */}
          <Box>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ fontWeight: 'bold', fontSize: '1rem' }}
            >
              {course.id} - {course.name.toUpperCase()}
            </Typography>
          </Box>
          
          {/* Course details with icons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            <Chip 
              icon={<AccessTimeIcon fontSize="small" />} 
              label={course.schedule} 
              size="small" 
              sx={{ bgcolor: '#f0f7ff', color: '#0057b7' }}
            />
            <Chip 
              icon={<MeetingRoomIcon fontSize="small" />} 
              label="Room" 
              size="small"
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <Chip 
              icon={<PersonIcon fontSize="small" />} 
              label={course.TA} 
              size="small"
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <Chip 
              icon={<PeopleIcon fontSize="small" />} 
              label={`${course.students} Students`} 
              size="small"
              sx={{ bgcolor: '#f5f5f5' }}
            />
            <Chip 
              icon={<ClassIcon fontSize="small" />} 
              label={`${course.credit} Credits`}
              size="small"
              sx={{ bgcolor: '#f5f5f5' }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// CourseList component to display all courses
const CourseList = ({ courses, searchTerm, semester, year }) => {
  // Filter courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    // Filter by search term (course name or ID)
    const matchesSearch = searchTerm ? 
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       course.id.toLowerCase().includes(searchTerm.toLowerCase())) : 
      true;
    
    // Filter by semester and year
    //basic
    const matchesSemester = semester ? course.semester.includes(semester) : true;
    const matchesYear = year ? course.semester.includes(year.toString()) : true;
    
    return matchesSearch && matchesSemester && matchesYear;
  });

  return (
    <Box sx={{ mt: 2 }}>
      {filteredCourses.length > 0 ? (
        <Grid container spacing={2}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} key={course.id}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="body1" color="text.secondary">
            No courses found matching your criteria.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CourseList;