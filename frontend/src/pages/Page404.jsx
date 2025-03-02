import { Typography, Button, Container, Box } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Page from "../components/Page";

// ----------------------------------------------------------------------

export default function Page404() {
  const navigate = useNavigate();

  return (
    <Page
      title="Page Not Found"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Ensure full height
      }}
    >
      <Container maxWidth="sm">
        <Box textAlign="center">
          {/* Animated 404 Text */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" color="primary" sx={{ fontWeight: "bold" }}>
              404
            </Typography>
          </motion.div>

          {/* Floating Text Effect */}
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <Typography variant="h5" color="textSecondary" gutterBottom>
              Oops! The page you are looking for does not exist.
            </Typography>
          </motion.div>

          {/* Go Home Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ mt: 3 }}
            >
              Go Home
            </Button>
          </motion.div>
        </Box>
      </Container>
    </Page>
  );
}
