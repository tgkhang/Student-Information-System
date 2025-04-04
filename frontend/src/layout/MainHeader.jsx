import { useContext, useEffect, useState } from "react";
// @mui
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  IconButton,
  Avatar,
  Badge,
  ClickAwayListener,
  Popper,
  Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';
// icons
import NotificationsIcon from '@mui/icons-material/Notifications';
// context
import { AuthContext } from "../contexts/JWTContext";
import Logo from "../assets/Logo.svg";
import NotificationList from "../components/Notifications";

const DRAWER_WIDTH = 280;

const HeaderStyle = styled(AppBar)(({ theme }) => ({
  width: "100%",
  backgroundColor: "#FCFDFF",
  color: "#407BFF",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function MainHeader({ isCollapse }) {
  const { isAuthenticated = true } = useContext(AuthContext);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleToggleNotifications = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenNotifications((prev) => !prev);
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  return (
    <HeaderStyle position="fixed">
      <Toolbar sx={{ px: { xs: 2, sm: 3.5 } }}>
        {/* Logo */}
        <Box component="img" src={Logo} alt="Logo" sx={{ width: 40, mr: 2 }} />
        <Typography sx={{ flexGrow: 1, fontWeight: 700, fontSize: "1.5rem" }}>
          InfoStudia
        </Typography>

        {/* Notification Bell & Avatar */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: "1em" }}>
          {!isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
              
              {/* Notification Bell */}
              <ClickAwayListener onClickAway={handleCloseNotifications}>
                <Box>
                  <IconButton onClick={handleToggleNotifications} color="inherit">
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!hasNotifications}
                      sx={{ "& .MuiBadge-dot": { width: 10, height: 10, borderRadius: "50%", top: 4, right: 4 } }}
                    >
                      <NotificationsIcon sx={{ fontSize: "2rem", stroke: "gray", strokeWidth: "1.5", color: "transparent" }} />
                    </Badge>
                  </IconButton>

                  {/* Notifications Dropdown */}
                  <Popper
                    open={openNotifications}
                    anchorEl={anchorEl}
                    placement="bottom-end"
                    sx={{ zIndex: 1200, mt: 1 }}
                  >
                    <Paper sx={{ width: "28rem", maxHeight: "20rem", overflowY: "auto", p: 1, boxShadow: 3 }}>
                      <NotificationList />
                    </Paper>
                  </Popper>
                </Box>
              </ClickAwayListener>

              {/* Avatar */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid primary.main",
                  bgcolor: "primary.main",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              />
            </Box>
          )}
        </Box>
      </Toolbar>
    </HeaderStyle>
  );
}