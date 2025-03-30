// components
import { Container, Box, Typography, Button, TextField} from "@mui/material";
import Page from "../../components/Page";

import Logo from "../../assets/Logo.svg"
import { guestContainerLogin, guestContainerLoginBox,
        guestContainerLoginSection, guestContainerLoginSubsection,
        guestLoginSection, guestRoundBlueButton } from "../../assets/styles/guest";

// ----------------------------------------------------------------------

export function BackgroundCircles() {
  return (
    <Box sx = {{ position: "absolute", width: "100vw", height: "100vh", overflow: "hidden" }}>
      <Box sx={{ width: "60rem", height: "55rem", borderRadius: "50%", backgroundColor: "#2970FF", position: "absolute",
                  top: -450, left: -270, zIndex: -1 }}
      />
      <Box sx={{ width: "50rem", height: "40rem", borderRadius: "50%", backgroundColor: "#2970FF", position: "absolute",
                  bottom: -330, right: -230, zIndex: -1 }}
      />
    </Box>
  );
}

export default function ForgotPassword() {
  return (
    <Page title="Forgot Password">

      <BackgroundCircles></BackgroundCircles>

      <Typography component="a" href="/home"
                    sx={{position: "absolute", top: "0.25em", right: "0.75em", zIndex: 10,
                        fontWeight: 800, color: "#407BFF", fontSize: "3rem", textDecoration: "none"}}>
          &lt;
      </Typography>

      <Container {...guestContainerLogin}>
        
        <Box sx={guestContainerLoginBox}>
          
          <Box sx={guestContainerLoginSection}>
            <Box sx={{display: "flex", flexDirection: "column", width: "90%", gap: "0.3em"}}>
              <Typography variant="h4">Forgot your</Typography>
              <Typography variant="h1" sx={{color: "#407BFF", fontWeight: 700}}>Password?</Typography>
            </Box>
          </Box>

          <Box sx={guestContainerLoginSection}>

            <Box sx={{...guestContainerLoginSubsection, alignItems: "center"}}>
              <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Box component="img" src={Logo} alt="InfoStudia" sx={{ width: "100%", maxWidth: 50 }} />
                <Typography variant="h4" sx={{color: "#407BFF", fontWeight: 700}}>Forgot Password</Typography>
              </Box>
              <Typography sx={guestLoginSection}>
                Please type your username in the box below and we will send you a recovery link through your email.
              </Typography>
            </Box>

            <Box sx={guestContainerLoginSubsection}>
              <TextField placeholder="Enter your username" 
                fullWidth variant="outlined" size="small"
                InputProps={{ sx: { borderRadius: "2em", fontSize: "0.8rem" }}}
                label="Username"
                InputLabelProps={{ sx: { fontSize: "0.8rem", "&.Mui-focused": { color: "#407BFF"} } }}
              />
            </Box>
            
            <Box sx={guestContainerLoginSubsection}>
              <Button sx={guestRoundBlueButton}>
                  Send recovery link
              </Button>
            </Box>

            <Box sx={guestContainerLoginSubsection}>
                <Typography sx={guestLoginSection}>
                  Remembered your password?{" "}
                  <Typography component="span" sx={{...guestLoginSection, color: "#407BFF", fontWeight: 600}}>
                    <Box component="a" href="/auth/login"
                        sx={{ fontSize: "0.8rem", textDecoration: "none", color: "#407BFF", fontWeight: 600,
                              "&:hover": { textDecoration: "underline" }}}>
                        Back to Login.
                    </Box>
                  </Typography>
                </Typography>
            </Box>

          </Box>

        </Box>
      
      </Container>

    </Page>
  );
}