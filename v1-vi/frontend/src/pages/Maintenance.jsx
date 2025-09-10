import { Link as RouterLink } from "react-router-dom";
import { Button, Typography, Container, Box } from "@mui/material";
import { motion } from "framer-motion";
import Page from "../components/Page";

// ----------------------------------------------------------------------

export default function Maintenance() {
  return (
    <Page
      title="Maintenance"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Full-screen height
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          {/* Animated Maintenance Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" paragraph color="primary" sx={{ fontWeight: "bold" }}>
              Maintenance
            </Typography>
          </motion.div>

          {/* Floating Message */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Typography sx={{ color: "text.secondary" }}>
              We are making some improvements. Please check back soon!
            </Typography>
          </motion.div>

          {/* Go Home Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button variant="contained" size="large" component={RouterLink} to="/" sx={{ mt: 3 }}>
              Go Home
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Page>
  );
}
