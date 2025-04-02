import { useContext, useEffect } from "react";
// @mui
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton 
} from "@mui/material";
import { styled } from '@mui/material/styles';
// icons
import MenuIcon from '@mui/icons-material/Menu';
// context
import { AuthContext } from "../contexts/JWTContext";
import Logo from "../assets/Logo.svg";

const DRAWER_WIDTH = 280;

const HeaderStyle = styled(AppBar, {
})(({theme }) => ({
  width: '100%',
  backgroundColor: "#FCFDFF",
  color: "#407BFF",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default function MainHeader({ isCollapse }) {
  const { isAuthenticated = true } = useContext(AuthContext );
  console.log(isCollapse);
  useEffect(() => {
    console.log(isCollapse);
  }
  , [isCollapse]);
  return (
    <HeaderStyle position="fixed" sx={{width: isCollapse ?  `calc(100% - 70px)` : `calc(100% - ${DRAWER_WIDTH}px)`}}>
      <Toolbar sx={{ px: { xs: 2, sm: 5 } }}>

        <Box
          component="img"
          src={Logo}
          alt="Logo"
          sx={{ width: 40, mr: 2 }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 800 }}
        >
          InfoStudia
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
          {["Home", "About", "Contact", "Services"].map((text, index) => (
            <Typography
              key={index}
              component="a"
              href={`/${text.toLowerCase()}`}
              sx={{
                textDecoration: "none",
                color: "#000",
                fontWeight: 400,
                mx: 2,
                fontSize: "1rem",
                "&:hover": { color: "#407BFF" },
                "&:active": { color: "#165EFF" },
              }}
            >
              {text}
            </Typography>
          ))}
          {!isAuthenticated && (
            <Button
              component="a"
              href="/auth/login"
              sx={{
                backgroundColor: "#407BFF",
                color: "white",
                fontWeight: 700,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: "8px",
                mx: 1.5,
                fontSize: "1rem",
                boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                "&:hover": { backgroundColor: "white", color: "#407BFF" },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </HeaderStyle>
  );
}