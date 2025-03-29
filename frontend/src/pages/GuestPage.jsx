// components
import { Container, Box, Typography, Button } from "@mui/material";
import Header from "../components/Header";
import Page from "../components/Page";
import FrontPicture from "/Guest Introduction.svg"
import { guestDefaultContainer, guestContainerMain,
        guestBlueButton, guestWhiteButton, guestSpanStrong } from "../assets/styles/guest";

// ----------------------------------------------------------------------

export default function GuestPage() {
    return (
      <Page title="InfoStudia">

        <Header />

        <Container {...guestContainerMain}>
                
                {/* Left Section */}

                <Container {...guestDefaultContainer}
                        sx={{ minHeight: "100vh", gap: "11em",
                            display: "flex", alignItems: "center", justifyContent: "space-between"}}>

                <Box sx={{flexGrow: 1, pr: "5em",
                            display: "flex", flexDirection: "column", justifyContent: "left", gap: "3.5em"}}>
                    <Box>
                        <Typography sx={{fontWeight: 500, fontSize: "4rem", lineHeight: 1.15, mb: "0.5em"}}>
                            Where education meets innovation.
                        </Typography>
                        <Typography variant="h6" sx={{color: "text.secondary", textAlign: "justify"}}>
                            Streamline student management with a powerful, all-in-one system
                            designed for modern institutions. Experience the future of
                            education management today, with 
                            <Typography component="span"
                                sx = {{...guestSpanStrong, fontSize: "1.4rem"}}> InfoStudia.</Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                    <Button
                        component="a"
                        href="/services"
                        sx={guestBlueButton}>
                            Get Started
                    </Button>
                    <Button
                        component="a"
                        href="/auth/login"
                        sx={guestWhiteButton}>
                            Learn More
                    </Button>
                    </Box>

                </Box>
                
                {/* Right Section*/}
                <Box component="img" src={FrontPicture} alt="InfoStudia" sx={{ width: "100%", maxWidth: 500}} />

            </Container>

        </Container>

      </Page>
    );
  }