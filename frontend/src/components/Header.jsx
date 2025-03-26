import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"

import Logo from "../assets/Logo.svg"

export default function Header({}) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100%",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#FCFDFF",
        color: "#407BFF",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.08)",
        px: "3em"
      }}
    >
      <Toolbar sx={{}}>
        <Box alt="Logo" sx={{ width: 40, mr: 2}}>
          <img src={Logo}/>
        </Box>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 800, color: "" }}>
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
                  mx: 1.5,
                  fontSize: "1rem",
                  "&:hover": { color: "#407BFF" },
                  "&:active": { color: "#165EFF" },
                }}
              >
                {text}
              </Typography>
          ))}
          <Button
            component="a"
            href="/login"
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
              "&:hover": { backgroundColor: "#165EFF" }, // Darker blue on hover
            }}
          >
            Login
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}