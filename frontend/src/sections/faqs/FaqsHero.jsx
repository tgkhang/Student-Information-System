import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import {
  Container,
  Stack,
  Typography,
  InputAdornment,
  TextField,
} from "@mui/material";
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  padding: theme.spacing(10, 2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  [theme.breakpoints.up("md")]: {
    height: 560,
    padding: 0,
  },
}));
// Animation Variants
const letterVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

const fadeUpVariant = (delay) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay } },
});

// ----------------------------------------------------------------------

export default function FaqsHero() {
  const title = "How can we help you?";

  return (
    <RootStyle>
      <Container sx={{ position: "relative" }}>
        <Stack
          spacing={3}
          component={motion.div}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Heading (Letter by Letter) */}
          <motion.div style={{ display: "flex", justifyContent: "center",  }}>
            <Typography
              variant="h1"
              color="primary"
              component="div"
              sx={{ display: "flex" }}
            >
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariant}
                  style={{ marginRight: char === " " ? "10px" : "0" }}
                >
                  {char}
                </motion.span>
              ))}
            </Typography>
          </motion.div>

          {/* Floating Subtext */}
          <motion.div variants={fadeUpVariant(0.3)} >
            <Typography variant="h3" sx={{ mt: 10 }}>
              Search for answers to common questions
            </Typography>
          </motion.div>

          {/* Search Input */}
          <motion.div variants={fadeUpVariant(0.6)}>
            <TextField
              fullWidth
              placeholder="Search support"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon={"eva:search-fill"}
                      sx={{ color: "text.disabled", width: 20, height: 20 }}
                    />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.paper",
                  borderRadius: 2,
                },
              }}
            />
          </motion.div>
        </Stack>
      </Container>
    </RootStyle>
  );
}
