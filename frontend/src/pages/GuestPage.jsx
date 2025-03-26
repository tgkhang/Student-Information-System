// components
import { Container, Box, Typography, Button } from "@mui/material";
import Header from "../components/Header";
import Page from "../components/Page";
import FrontPicture from "/Guest Introduction.svg"

// ----------------------------------------------------------------------

export default function GuestPage() {
    return (
      <Page title="InfoStudia">

        <Header />

        <Container disableGutters maxWidth={'xl'} /* Outside Container*/
                sx={{ px: "6.5em" }}>

                <Container disableGutters maxWidth={'xl'}
                        sx={{ minHeight: "100vh", gap: "11em",
                            display: "flex", alignItems: "center", justifyContent: "space-between"}}>

                <Box sx={{flexGrow: 1, pr: "5em",
                            display: "flex", flexDirection: "column", justifyContent: "left", gap: "3.5em"}}>
                    <Box>
                        <Typography fontWeight={500} fontSize="4rem" lineHeight={1.15} mb="0.5em">
                            Where education meets innovation.
                        </Typography>
                        <Typography color="text.secondary" fontSize="1.4rem" textAlign={"justify"}>
                            Streamline student management with a powerful, all-in-one system
                            designed for modern institutions. Experience the future of
                            education management today, with 
                            <Typography component="span" color="#407BFF" fontSize="1.4rem" fontWeight={700}> InfoStudia.</Typography>
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                    <Button
                        component="a"
                        href="/services"
                        sx={{
                            width: "45%",
                            backgroundColor: "#407BFF",
                            color: "white",
                            fontWeight: 700,
                            textTransform: "none",
                            p: "0.8em",
                            borderRadius: "8px",
                            fontSize: "1.2rem",
                            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                            "&:hover": { backgroundColor: "white", color: "#407BFF" }
                        }}>
                            Get Started
                    </Button>
                    <Button
                        component="a"
                        href="/login"
                        sx={{
                            width: "45%",
                            backgroundColor: "white",
                            color: "#407BFF",
                            fontWeight: 700,
                            textTransform: "none",
                            p: "0.8em",
                            borderRadius: "8px",
                            fontSize: "1.2rem",
                            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
                            "&:hover": { backgroundColor: "#407BFF", color: "white" }
                        }}>
                            Learn More
                    </Button>
                    </Box>

                </Box>

                <Box component="img" src={FrontPicture} alt="InfoStudia" sx={{ width: "100%", maxWidth: 500}} />

            </Container>

        </Container>

      </Page>
    );
  }