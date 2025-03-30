// components
import { Container, Box, Typography, Button, TextField, FormControlLabel, Checkbox } from "@mui/material";
import Page from "../../components/Page";

import { BackgroundCircles } from "../authentication/ForgotPassword"
import Logo from "../../assets/Logo.svg"
import { guestContainerLogin, guestContainerLoginBox,
        guestContainerLoginSection, guestContainerLoginSubsection,
        guestLoginSection, guestRoundBlueButton } from "../../assets/styles/guest";

// ----------------------------------------------------------------------

export default function Login() {
    return (
      <Page title="Login">

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
                <Typography variant="h4">Reset your</Typography>
                <Typography variant="h1" sx={{color: "#407BFF", fontWeight: 700}}>Password.</Typography>
              </Box>
            </Box>

            <Box sx={guestContainerLoginSection}>

              <Box sx={{...guestContainerLoginSubsection, alignItems: "center"}}>
                <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <Box component="img" src={Logo} alt="InfoStudia" sx={{ width: "100%", maxWidth: 50 }} />
                  <Typography variant="h4" sx={{color: "#407BFF", fontWeight: 700}}>Reset Password</Typography>
                </Box>
                <Typography sx={guestLoginSection}>
                  You have chosen to reset your password.<br />
                  Make sure you remember your new password.
                </Typography>
              </Box>

              <Box sx={guestContainerLoginSubsection}>
                <TextField placeholder="Enter new password" 
                  fullWidth variant="outlined" size="small"
                  InputProps={{ sx: { borderRadius: "2em", fontSize: "0.8rem" }}}
                  label="New password"
                  InputLabelProps={{ sx: { fontSize: "0.8rem", "&.Mui-focused": { color: "#407BFF"} } }}
                />
                <TextField placeholder="Re-enter new password" 
                  fullWidth variant="outlined" size="small"
                  InputProps={{ sx: { borderRadius: "2em", fontSize: "0.8rem" }}}
                  label="Re-enter new password"
                  InputLabelProps={{ sx: { fontSize: "0.8rem", "&.Mui-focused": { color: "#407BFF"} } }}
                />
              </Box>
              
              <Box sx={guestContainerLoginSubsection}>
                <Button sx={guestRoundBlueButton}>
                    Reset password
                </Button>
              </Box>

            </Box>

          </Box>
          

        </Container>

      </Page>
    );
}