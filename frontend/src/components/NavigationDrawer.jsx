import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import Box from '@mui/material/Box';
const drawerWidth = 240;

export default function NavigationDrawer({ isDrawerOpen, toggleDrawer }) {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={isDrawerOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          marginTop: '65px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: 'calc(100vh - 65px)',
        },
      }}
    >
      <List>
        {['Dashboard', 'Courses', 'Schedule', 'Class Registration', 'Tuition fee'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box >
        <ListItem button>
          <ListItemText primary="John Doe" secondary="Student" />
          <LogoutIcon /> 
        </ListItem>
      </Box>
    </Drawer>
  );
}