import { Typography, Button, Container, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import Page from "../components/Page";

// ----------------------------------------------------------------------

export default function ComingSoon() {
  return (
    <Page
      title="Coming Soon"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Full-screen height
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          {/* Animated "Coming Soon" Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" paragraph color="primary" sx={{ fontWeight: "bold" }}>
              Coming Soon
            </Typography>
          </motion.div>

          {/* Floating Message */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Typography sx={{ color: "text.secondary" }}>
              We’re working on something exciting! Stay tuned.
            </Typography>
          </motion.div>

          {/* Go Home Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button variant="contained" size="large" component={RouterLink} to="/" sx={{ mt: 3 }}>
              Go to Home
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Page>
  );
}
