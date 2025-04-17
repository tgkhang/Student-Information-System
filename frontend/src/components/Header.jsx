import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";

import Logo from "../assets/Logo.svg";

export default function Header() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Services", path: "/services" }
  ];

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "primary.lighter",
        color: "primary.main",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
        px: "5em"
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Box component="img" src={Logo} alt="Logo" sx={{ width: 40, mr: 2 }} />

        {/* Brand name */}
        <Typography sx={{ flexGrow: 1, fontWeight: 700, fontSize: "1.5rem" }}>
          InfoStudia
        </Typography>

        {/* Navigation + Login */}
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {navItems.map(({ label, path }) => {
            const isActive = currentPath === path;
            return (
              <Typography
                key={path}
                component={Link}
                to={path}
                sx={{
                  textDecoration: "none",
                  color: isActive ? "primary.main" : "secondary.darker",
                  fontWeight: isActive ? 600 : 400,
                  mx: 2,
                  fontSize: "1rem",
                  "&:hover": { color: "primary.main" }
                }}
              >
                {label}
              </Typography>
            );
          })}

          {/* Login Button */}
          <Button
            onClick={() => {window.location.href="/auth/login"}}
            sx={{
              backgroundColor: "primary.main",
              color: "primary.lighter",
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1,
              borderRadius: "8px",
              mx: 1.5,
              fontSize: "1rem",
              boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                backgroundColor: "primary.lighter",
                color: "primary.main"
              }
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
