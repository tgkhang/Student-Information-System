import {useContext } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { 
  Box,
  List,
  Drawer,
  Divider,
  Typography,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Tooltip,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AuthContext } from '../contexts/JWTContext';
// icons
import MenuIcon from '@mui/icons-material/Menu';
import { navAdminConfig, navTeacherConfig, navStudentConfig } from './NavConfig';
// Constants
const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 70;

const ListItemIconStyle = styled(ListItemIcon)({
  width: 22,
  height: 22,
  color: 'inherit',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
// Sidebar Component
export default function MainSideBar({ isOpenSidebar, onToggleSidebar }) {
  // Internal collapsed state
  const { user } = useContext(AuthContext);
  const navConfig = user?.role === 'admin' ? navAdminConfig : user?.role === 'teacher' ? navTeacherConfig : navStudentConfig;
  const renderContent = (
    <>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: isOpenSidebar ? 'center' : 'space-between', 
        p: isOpenSidebar ? 1 : 2,
        minHeight: 64
      }}>
        {isOpenSidebar ? (
          <IconButton onClick={onToggleSidebar} color="primary">
            <MenuIcon />
          </IconButton>
        ) : (
          <>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#407BFF' }}>
              InfoStudia Menu
            </Typography>
            <IconButton onClick={onToggleSidebar}>
              <MenuIcon />
            </IconButton>
          </>
        )}
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <List disablePadding sx={{ p: 1 }}>
        {navConfig.map((item) => (
          <NavItem key={item.title} item={item} isOpenSidebar={isOpenSidebar} />
        ))}
      </List>

      {/* Spacer to push the user profile to the bottom */}
      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />
      
      {/* User Profile Section */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpenSidebar ? 'center' : 'flex-start',
        }}
      >
        <Avatar 
          src={user?.avatar || undefined} 
          alt={user?.name || "User Avatar"}
          sx={{ 
            width: 40, 
            height: 40,
            border: '2px solid #407BFF',
            bgcolor: user?.avatar ? 'transparent' : 'grey.300',
            color: 'white', 
            fontWeight: 'bold',
            fontSize: 18
          }}
        >
          {!user?.avatar && user?.name ? user.name.charAt(0).toUpperCase() : ''}
        </Avatar>
        
        {!isOpenSidebar && (
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
              {user?.name || "Unknown"}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'capitalize'  }}>
              {user?.role || "unknown"} 
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );

  return (
    <Drawer
      open={isOpenSidebar}
      variant="permanent"
      sx={{
        width: isOpenSidebar ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        transition: theme => theme.transitions.create('width', {
          duration: theme.transitions.duration.standard,
        }),
        '& .MuiDrawer-paper': {
          width: isOpenSidebar ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          transition: theme => theme.transitions.create('width', {
            duration: theme.transitions.duration.standard,
          }),
          bgcolor: 'background.default',
          position: 'fixed',
          height: '100%',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }
      }}
    >
      {renderContent}
    </Drawer>
  );
}

// Navigation Item Component
function NavItem({ item, isOpenSidebar }) {
  const { title, path, icon } = item;

  const listItemButton = (
    <ListItemButton
      component={RouterLink}
      to={path}
      sx={{
        height: 48,
        position: 'relative',
        textTransform: 'capitalize',
        color: 'text.secondary',
        borderRadius: 1,
        '&.active': {
          color: 'primary.main',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
        mb: 0.5,
        '&:hover': {
          bgcolor: 'action.hover',
          color: '#407BFF',
        },
        justifyContent: isOpenSidebar ? 'center' : 'flex-start',
        px: isOpenSidebar ? 1 : 3,
      }}
    >
      <ListItemIconStyle>{icon}</ListItemIconStyle>
      {!isOpenSidebar && (
        <ListItemText 
          disableTypography 
          primary={title} 
          sx={{ textTransform: 'capitalize', ml: 1 }} 
        />
      )}
    </ListItemButton>
  );

  return isOpenSidebar ? (
    <Tooltip title={title} placement="right">
      {listItemButton}
    </Tooltip>
  ) : (
    listItemButton
  );
}