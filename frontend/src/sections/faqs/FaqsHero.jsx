import { m } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Container, Stack, Typography, InputAdornment, TextField } from "@mui/material";
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  backgroundSize: "cover",
  backgroundPosition: "center",
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

const ContentStyle = styled(Stack)(() => ({
  textAlign: "center",
  alignItems: "center",
  maxWidth: 600,
  margin: "auto",
}));

// Animation Variants
const fadeVariant = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const bounceVariant = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: [0, -5, 0],
    transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" },
  },
};

// ----------------------------------------------------------------------

export default function FaqsHero() {
  return (
    <RootStyle>
      <Container sx={{ position: "relative" }}>
        <ContentStyle spacing={4}>
          {/* Animated Heading */}
          <m.div variants={fadeVariant} initial="hidden" animate="visible">
            <Typography variant="h3" color="primary">
              How can we help you?
            </Typography>
          </m.div>

          {/* Floating Subtext */}
          <m.div variants={bounceVariant} initial="hidden" animate="visible">
            <Typography variant="h6" color="textSecondary">
              Search for answers to common questions
            </Typography>
          </m.div>

          {/* Search Input */}
          <m.div variants={fadeVariant} initial="hidden" animate="visible">
            <TextField
              fullWidth
              placeholder="Search support"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon={"eva:search-fill"} sx={{ color: "text.disabled", width: 20, height: 20 }} />
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
          </m.div>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
