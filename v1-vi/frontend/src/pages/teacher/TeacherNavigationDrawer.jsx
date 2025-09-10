"use client"

import React, { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Drawer from "@mui/material/Drawer"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import LogoutIcon from "@mui/icons-material/Logout"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Avatar from "@mui/material/Avatar"
import DashboardIcon from "@mui/icons-material/Dashboard"
import SchoolIcon from "@mui/icons-material/School"
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"
import GradeIcon from "@mui/icons-material/Grade"
import SettingsIcon from "@mui/icons-material/Settings"
import HelpIcon from "@mui/icons-material/Help"
import { styled } from "@mui/material/styles"
import Tooltip from "@mui/material/Tooltip"
import Collapse from "@mui/material/Collapse"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import AssignmentIcon from "@mui/icons-material/Assignment"
import EventNoteIcon from "@mui/icons-material/EventNote"
import PersonIcon from "@mui/icons-material/Person"
import Badge from "@mui/material/Badge"

const drawerWidth = 240

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: "8px",
  margin: "4px 8px",
  padding: "8px 16px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: active ? theme.palette.primary.light : "transparent",
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  "& .MuiListItemIcon-root": {
    color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
    minWidth: 40,
  },
  "& .MuiListItemText-primary": {
    fontWeight: active ? 600 : 400,
    fontSize: "0.9rem",
  },
  "&:hover": {
    backgroundColor: active ? theme.palette.primary.light : theme.palette.action.hover,
    "& .MuiListItemIcon-root": {
      color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
    },
  },
}))

const NestedListItem = styled(ListItem)(({ theme, active }) => ({
  borderRadius: "8px",
  margin: "2px 8px 2px 24px",
  padding: "6px 16px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  backgroundColor: active ? theme.palette.primary.light : "transparent",
  color: active ? theme.palette.primary.contrastText : theme.palette.text.primary,
  "& .MuiListItemIcon-root": {
    color: active ? theme.palette.primary.contrastText : theme.palette.primary.main,
    minWidth: 32,
  },
  "& .MuiListItemText-primary": {
    fontWeight: active ? 600 : 400,
    fontSize: "0.85rem",
  },
  "&:hover": {
    backgroundColor: active ? theme.palette.primary.light : theme.palette.action.hover,
  },
}))

export default function NavigationDrawer({ isDrawerOpen, toggleDrawer }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [openSubMenu, setOpenSubMenu] = useState("")

  // Get pending assignments count 
  const pendingAssignmentsCount = 3

  // Define menu items with paths and nested items
  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/teacher/dashboard",
    },
    {
      text: "Courses",
      icon: <SchoolIcon />,
      path: "/teacher/course",
    },
    {
      text: "Review",
      icon: <CalendarMonthIcon />,
      path: "/teacher/review",
    },
  ]

  const bottomMenuItems = [
    { text: "Settings", icon: <SettingsIcon fontSize="small" />, path: "/settings" },
    { text: "Help Center", icon: <HelpIcon fontSize="small" />, path: "/help" },
  ]

  // Handle submenu toggle
  const handleSubMenuToggle = (menuText) => {
    setOpenSubMenu(openSubMenu === menuText ? "" : menuText)
  }

  // Check if a path is active
  const isActive = (path) => {
    if (path.includes("?tab=")) {
      const basePath = path.split("?")[0]
      const tabParam = path.split("tab=")[1]
      return (
        location.pathname === basePath &&
        (location.search.includes(`tab=${tabParam}`) || (!location.search && tabParam === "0"))
      )
    }
    return location.pathname === path
  }

  // Check if any subitem is active
  const isSubMenuActive = (item) => {
    if (!item.subItems) return false
    return item.subItems.some((subItem) => isActive(subItem.path))
  }

  // Navigate to path
  const handleNavigation = (path) => {
    navigate(path)
  }

  // Handle logout
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...")
  }

  // Auto-open submenu if a subitem is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.subItems && item.subItems.some((subItem) => isActive(subItem.path))) {
        setOpenSubMenu(item.text)
      }
    })
  }, [location.pathname, location.search])

  return (
    <Drawer
      variant="persistent"
      open={isDrawerOpen}
      sx={{
        width: isDrawerOpen ? drawerWidth : 0,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          padding: "16px 0",
          borderRight: "1px solid rgba(0, 0, 0, 0.08)",
          overflowX: "hidden",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          ...(!isDrawerOpen && {
            width: 0,
            padding: 0,
            overflowX: "hidden",
          }),
        },
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Main Menu */}
        <List sx={{ px: 1, flexGrow: 1 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <StyledListItem
                active={isActive(item.path) || isSubMenuActive(item) ? 1 : 0}
                onClick={() => (item.subItems ? handleSubMenuToggle(item.text) : handleNavigation(item.path))}
              >
                <ListItemIcon>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {item.subItems && (openSubMenu === item.text ? <ExpandLess /> : <ExpandMore />)}
              </StyledListItem>

              {item.subItems && (
                <Collapse in={openSubMenu === item.text} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <NestedListItem
                        key={subItem.text}
                        active={isActive(subItem.path) ? 1 : 0}
                        onClick={() => handleNavigation(subItem.path)}
                      >
                        <ListItemIcon>
                          {subItem.text === "Student Info" ? (
                            <PersonIcon fontSize="small" />
                          ) : subItem.text === "Academic Results" ? (
                            <GradeIcon fontSize="small" />
                          ) : subItem.text === "Subject Scores" ? (
                            <AssignmentIcon fontSize="small" />
                          ) : subItem.text === "My Classes" ? (
                            <EventNoteIcon fontSize="small" />
                          ) : subItem.text === "Assignments" ? (
                            <Badge badgeContent={subItem.badge} color="error">
                              <AssignmentIcon fontSize="small" />
                            </Badge>
                          ) : null}
                        </ListItemIcon>
                        <ListItemText primary={subItem.text} />
                      </NestedListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        {/* Bottom Section */}
        <Box>
          <Divider sx={{ my: 1 }} />
          <List sx={{ px: 1 }}>
            {bottomMenuItems.map((item) => (
              <StyledListItem
                key={item.text}
                active={isActive(item.path) ? 1 : 0}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  py: 0.5,
                  minHeight: "40px",
                  "& .MuiListItemIcon-root": {
                    minWidth: 32,
                    fontSize: "small",
                  },
                  "& .MuiListItemText-primary": {
                    fontSize: "0.85rem",
                  },
                }}
              >
                <ListItemIcon sx={{ fontSize: "small" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </StyledListItem>
            ))}
          </List>
          <Divider sx={{ my: 1 }} />

          {/* User Profile Section */}
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 1.5,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  cursor: "pointer",
                },
              }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main", mr: 2 }}>JD</Avatar>
              <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  John Doe
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  Student
                </Typography>
              </Box>
              <Tooltip title="Logout">
                <LogoutIcon sx={{ ml: 1, color: "text.secondary", cursor: "pointer" }} onClick={handleLogout} />
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  )
}

