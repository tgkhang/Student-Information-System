import { useEffect, useState } from "react";

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
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
// icons
import NotificationsIcon from "@mui/icons-material/Notifications";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
// context
import useAuth from "../hooks/useAuth";
import Logo from "../assets/Logo.svg";
import NotificationList from "../components/Notifications";
import ProfileMenu from "../components/ProfileMenu";
// utils
import { getNotificationListApi, getTeacherNoti, getStudentNoti, markStudentNotiAsRead, markTeacherNotiAsRead } from "../utils/api";

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

export default function MainHeader() {
  const { isAuthenticated, user } = useAuth();
  const [hasNotifications, setHasNotifications] = useState(true);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [anchorNotif, setAnchorNotif] = useState(null);
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [anchorProfile, setAnchorProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const handleToggleNotifications = (event) => {
    setAnchorNotif(event.currentTarget);
    setOpenNotifications((prev) => !prev);
    setOpenProfileMenu(false); // close profile menu if open
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };
  const renderRoleIcon = () => {
    if (user.role === "admin") {
      return <AdminPanelSettingsIcon sx={{ color: "white" }} />;
    } else if (user.role === "teacher") {
      return <SchoolIcon sx={{ color: "white" }} />;
    } else if (user.role === "student") {
      return <PersonIcon sx={{ color: "white" }} />;
    }
    return null;
  };
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (user.role === "student") {
          const response = await getStudentNoti();
        setNotifications(response.data);
        const allRead = response.data.every(notification => notification?.isRead === true);
        setHasNotifications(!allRead);
        }
        else if (user.role === "teacher") {
          const response = await getTeacherNoti();
          console.log(response)
        setNotifications(response.data);
        const allRead = response.data.every(notification => notification?.isRead === true);
        setHasNotifications(!allRead);
        }
        else {
          const response = await getNotificationListApi();
        setNotifications(response.data);
        const allRead = response.data.every(notification => notification?.isRead === true);
        setHasNotifications(!allRead);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
    fetchNotifications();
  }, [user]);
  const handleToggleProfileMenu = (event) => {
    setAnchorProfile(event.currentTarget);
    setOpenProfileMenu((prev) => !prev);
    setOpenNotifications(false); // close notifications if open
  };

  const handleCloseProfileMenu = () => {
    setOpenProfileMenu(false);
  };

  const markAsRead = async (id) => {
    if (user?.role === "student") {
      await markStudentNotiAsRead(id);
      const updated = notifications.map((noti) =>
        noti._id === id ? { ...noti, isRead: true } : noti
      );
      setNotifications(updated);
      setHasNotifications(!updated.every((n) => n?.isRead));
    }
    else if (user?.role === "teacher") {
      await markTeacherNotiAsRead(id);
      const updated = notifications.map((noti) =>
        noti._id === id ? { ...noti, isRead: true } : noti
      );
      setNotifications(updated);
      setHasNotifications(!updated.every((n) => n?.isRead));
    }
  }

  return (
    <HeaderStyle position="fixed">
      <Toolbar sx={{ px: { xs: 2, sm: 3.5 } }}>
        {/* Logo */}
        <Box component="img" src={Logo} alt="Logo" sx={{ width: 40, mr: 2 }} onClick={() => {window.location.href="/"}}/>
        <Typography sx={{ flexGrow: 1, fontWeight: 700, fontSize: "1.5rem" }}>
          InfoStudia
        </Typography>

        {/* Notification Bell & Avatar */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: "1em",
          }}
        >
          {isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center", gap: "1em" }}>
              <ClickAwayListener onClickAway={handleCloseNotifications}>
                <Box>
                  <IconButton
                    onClick={handleToggleNotifications}
                    color="inherit"
                  >
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!hasNotifications}
                      sx={{
                        "& .MuiBadge-dot": {
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          top: 4,
                          right: 4,
                        },
                      }}
                    >
                      <NotificationsIcon
                        sx={{
                          fontSize: "2rem",
                          stroke: "gray",
                          strokeWidth: "1.5",
                          color: "transparent",
                        }}
                      />
                    </Badge>
                  </IconButton>

                  {/* Notifications Dropdown */}
                  <Popper
                    open={openNotifications}
                    anchorEl={anchorNotif}
                    placement="bottom-end"
                    modifiers={[
                      {
                        name: "offset",
                        options: {
                          offset: [0, 8],
                        },
                      },
                    ]}
                    sx={{ zIndex: 1501 }}
                  >
                    <Paper sx={{ width: "28rem", maxHeight: "20rem", overflowY: "auto",
                      p: 1, boxShadow: 3, borderRadius: 0,
                      '&::-webkit-scrollbar': { width: '5px'},
                      '&::-webkit-scrollbar-track': { backgroundColor: "primary.lighter" },
                      '&::-webkit-scrollbar-thumb': { backgroundColor: "primary.main", borderRadius: '3px' },
                      '&::-webkit-scrollbar-thumb:hover': { backgroundColor: "primary.dark" },
                      }}>
                      <NotificationList notifications={notifications} role={user?.role} markAsRead={markAsRead}/>
                    </Paper>
                  </Popper>
                </Box>
              </ClickAwayListener>

              {/* Avatar & Profile Menu */}
              <ClickAwayListener onClickAway={handleCloseProfileMenu}>
                <Box>
                  <IconButton onClick={handleToggleProfileMenu}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        border: "2px solid",
                        borderColor: "primary.main",
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18
                      }}
                    >
                      {user?.name?.charAt(0) || ""}
                    </Avatar>
                  </IconButton>

                  <ProfileMenu
                    user={user}
                    anchorEl={anchorProfile}
                    open={openProfileMenu}
                    onClose={handleCloseProfileMenu}
                  />
                </Box>
              </ClickAwayListener>
            </Box>
          )}
        </Box>
      </Toolbar>
    </HeaderStyle>
  );
}
