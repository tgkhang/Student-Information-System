import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Header from '../../components/Header';
import NavigationDrawer from '../../components/NavigationDrawer';


const drawerWidth = 240;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function StudentClassesAndAssignmentsPage() {
  const [value, setValue] = React.useState(0); // For tabs
  const [semester, setSemester] = React.useState(''); // For semester spinner
  const [year, setYear] = React.useState(''); // For year spinner
  const [isDrawerOpen, setDrawerOpen] = React.useState(false); // For navbar drawer

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  // Sample data 
  const registeredClasses = [
    { subjectName: 'Subject1', credit: 1, class: 1, teacher: 1, ta: 1, time: 1, note: 1 },
    { subjectName: 'Subject2', credit: 2, class: 2, teacher: 2, ta: 2, time: 2, note: 2 },
    { subjectName: 'Subject3', credit: 3, class: 3, teacher: 3, ta: 3, time: 3, note: 3 },
    { subjectName: 'Subject4', credit: 4, class: 4, teacher: 4, ta: 4, time: 4, note: 4 },
    { subjectName: 'Subject5', credit: 5, class: 5, teacher: 5, ta: 5, time: 5, note: 5 },
  ];

  return (
    <Box sx={{ flexGrow: 1 ,pt:'3.2rem' }}>
      {/* Header and Navigation Drawer */}
      <Header toggleDrawer={toggleDrawer} />
      <NavigationDrawer isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />

      {/* Main Content */}
      <Box
        sx={{
          marginLeft: isDrawerOpen ? `${drawerWidth}px` : 0,
          padding: '20px',
          transition: 'margin-left 0.3s',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Classes and Assignments
        </Typography>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Registered Classes" {...a11yProps(0)} />
            <Tab label="Assignments" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Registered Classes Tab */}
        <TabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
            {/* Semester Spinner */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="semester-select-label">Semester</InputLabel>
              <Select
                labelId="semester-select-label"
                id="semester-select"
                value={semester}
                label="Semester"
                onChange={handleSemesterChange}
              >
                <MenuItem value={1}>Semester 1</MenuItem>
                <MenuItem value={2}>Semester 2</MenuItem>
                <MenuItem value={3}>Semester 3</MenuItem>
              </Select>
            </FormControl>

            {/* Year Spinner */}
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="year-select-label">Year</InputLabel>
              <Select
                labelId="year-select-label"
                id="year-select"
                value={year}
                label="Year"
                onChange={handleYearChange}
              >
                <MenuItem value={2023}>2022-2023</MenuItem>
                <MenuItem value={2024}>2023-2024</MenuItem>
                <MenuItem value={2025}>2024-2025</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Table for Registered Classes */}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        {/* Assignments Tab */}
        <TabPanel value={value} index={1}>
          <Typography variant="h6">Assignments content will go here.</Typography>
        </TabPanel>
      </Box>
    </Box>
  );
}