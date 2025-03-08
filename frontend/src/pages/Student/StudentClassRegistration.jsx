import * as React from 'react';
import Box from '@mui/material/Box';
import Header from '../../components/Header';
import NavigationDrawer from '../../components/NavigationDrawer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const drawerWidth = 240;

export default function StudentClassRegistrationPage() {
  const [isDrawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const registeredClasses = [
    { subjectName: 'Subject1', credit: 1, class: 1, teacher: 1, ta: 1, time: 1, note: 1 },
    { subjectName: 'Subject2', credit: 2, class: 2, teacher: 2, ta: 2, time: 2, note: 2 },
    { subjectName: 'Subject3', credit: 3, class: 3, teacher: 3, ta: 3, time: 3, note: 3 },
    { subjectName: 'Subject4', credit: 4, class: 4, teacher: 4, ta: 4, time: 4, note: 4 },
    { subjectName: 'Subject5', credit: 5, class: 5, teacher: 5, ta: 5, time: 5, note: 5 },
  ];

  const classesList = [
    { subjectName: 'Subject 1', credit: 1, class: 1, teacher: 1, ta: 1, note: 1, time: 1 },
    { subjectName: 'Subject 2', credit: 2, class: 2, teacher: 2, ta: 2, note: 2, time: 2 },
    { subjectName: 'Subject 3', credit: 3, class: 3, teacher: 3, ta: 3, note: 3, time: 3 },
    { subjectName: 'Subject 4', credit: 4, class: 4, teacher: 4, ta: 4, note: 4, time: 4 },
    { subjectName: 'Subject 5', credit: 5, class: 5, teacher: 5, ta: 5, note: 5, time: 5 },
  ];

  const handleDelete = (subjectName) => {
    console.log(`Delete ${subjectName}`);
    // Add your delete logic here
  };

  const handleEnroll = (subjectName) => {
    console.log(`Enroll in ${subjectName}`);
    // Add your enroll logic here
  };

  return (
    <Box sx={{ paddingTop: '3.2rem' , justifyContent:'center', alignItems:'center', height:'100vh'}}>
      <Header toggleDrawer={toggleDrawer} />
      <NavigationDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
      <Box sx={{ marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0, padding: '20px', transition: 'margin-left 0.3s' }}>
        
        {/* Semester Information */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main', marginBottom: '20px' }}>
          Semester 2, 2024-2025
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ marginTop: '20px', fontWeight: 'bold', color: 'primary.main' }}>
          REGISTERED CLASSES
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject Name</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>TA</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Cancel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registeredClasses.map((row) => (
                <TableRow key={row.subjectName}>
                  <TableCell>{row.subjectName}</TableCell>
                  <TableCell>{row.credit}</TableCell>
                  <TableCell>{row.class}</TableCell>
                  <TableCell>{row.teacher}</TableCell>
                  <TableCell>{row.ta}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>{row.note}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="error" onClick={() => handleDelete(row.subjectName)}>
                      DELETE
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h5" gutterBottom sx={{ marginTop: '20px', fontWeight: 'bold', color: 'primary.main' }}>
          CLASSES LIST
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject Name</TableCell>
                <TableCell>Credit</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>TA</TableCell>
                <TableCell>Note</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Cancel</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classesList.map((row) => (
                <TableRow key={row.subjectName}>
                  <TableCell>{row.subjectName}</TableCell>
                  <TableCell>{row.credit}</TableCell>
                  <TableCell>{row.class}</TableCell>
                  <TableCell>{row.teacher}</TableCell>
                  <TableCell>{row.ta}</TableCell>
                  <TableCell>{row.note}</TableCell>
                  <TableCell>{row.time}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEnroll(row.subjectName)}>
                      ENROLL
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}