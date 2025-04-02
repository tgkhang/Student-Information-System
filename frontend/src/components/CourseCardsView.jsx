import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Rating,
  Button,
  Divider
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import ReviewsIcon from '@mui/icons-material/Reviews';

// Course card component
const CourseCard = ({ course, onSelectCourse }) => {
  const completionPercentage = (course.reviewsCompleted / course.totalReviews) * 100;
  
  return (
    <Card 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        height: '100%',
        border: '1px solid #e0e0e0',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 0.5, 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            {course.id}
          </Typography>
          <Typography variant="subtitle1">
            {course.name}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 1.5 }}/>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          <Chip 
            icon={<AccessTimeIcon fontSize="small" />} 
            label={course.schedule.split(' ')[0]} 
            size="small"
            sx={{ bgcolor: '#f0f7ff', color: '#0057b7' }}
          />
          <Chip 
            icon={<PeopleIcon fontSize="small" />} 
            label={`${course.students} Students`} 
            size="small"
            sx={{ bgcolor: '#f5f5f5' }}
          />
          <Chip 
            icon={<PersonIcon fontSize="small" />} 
            label={course.TA} 
            size="small"
            sx={{ bgcolor: '#f5f5f5' }}
          />
        </Box>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Review Completion
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ flexGrow: 1, mr: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={completionPercentage} 
                sx={{ 
                  height: 6, 
                  borderRadius: 5,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: completionPercentage >= 80 ? '#4caf50' : 
                                     completionPercentage >= 50 ? '#ff9800' : '#f44336'
                  }
                }} 
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {completionPercentage.toFixed(0)}%
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            {course.reviewsCompleted} of {course.totalReviews} reviews
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center'}}>
            <Rating value={course.averageRating || 0} precision={0.5} readOnly size="small" />
            <Typography variant="body2" sx={{ ml: 1,mr:1, fontWeight: 'medium' }}>
              {course.averageRating?.toFixed(1) || "N/A"}
            </Typography>
          </Box>
          <Button 
            size="small" 
            variant="outlined" 
            color="primary"
            onClick={() => onSelectCourse(course)}
            startIcon={<ReviewsIcon />}
          >
            View Reviews
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Course cards grid component
const CourseCardsView = ({ courses, searchTerm, semester, year, onSelectCourse }) => {
  // Filter courses based on search term and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = searchTerm ? 
      (course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       course.id.toLowerCase().includes(searchTerm.toLowerCase())) : 
      true;
    
    // Filter by semester and year
    const matchesSemester = semester ? course.semester.includes(semester.toString()) : true;
    
    //TO DO : Fix year filter
    const matchesYear = year ? course.semester.includes(year.toString()) : true;
    
    return matchesSearch && matchesSemester && matchesYear;
  });

  return (
    <Box sx={{ mt: 2 }}>
      {filteredCourses.length > 0 ? (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <CourseCard 
                course={course} 
                onSelectCourse={onSelectCourse}
              />
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

export default CourseCardsView;