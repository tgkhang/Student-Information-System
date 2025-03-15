"use client"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"

export default function Header({ toggleDrawer }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "white",
        color: "primary.main",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
      }}
    >
      <Toolbar>
        <IconButton size="small" edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "primary.main" }}>
          InfoStudia
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {/* Add user profile or other actions here */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

