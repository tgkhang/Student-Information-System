import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// components
import { Container, Box, Typography, Button, TextField } from "@mui/material";
import { motion } from "framer-motion";
import Page from "../../components/Page";

import Logo from "../../assets/Logo.svg";
import { ChevronLeft } from "@mui/icons-material";

import {
  guestContainerLogin,
  guestContainerLoginBox,
  guestContainerLoginSection,
  guestContainerLoginSubsection,
  guestLoginSection,
  guestRoundBlueButton,
} from "../../assets/styles/guest";
import { forgotPassword  } from "../../utils/api";
import { useSnackbar } from "notistack";
// ----------------------------------------------------------------------

export function BackgroundCircles() {

  return (
    <Box
      sx={{
        position: "absolute",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -200 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 1, ease: "easeOut" },
        }}
        style={{
          position: "absolute",
          width: "60rem",
          height: "55rem",
          borderRadius: "50%",
          backgroundColor: "#2970FF",
          top: -450,
          left: -270,
          zIndex: -1,
        }}
      />
      <motion.div
        initial={{ opacity: 0, x: 200 }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 1, ease: "easeOut" },
        }}
        style={{
          position: "absolute",
          width: "50rem",
          height: "40rem",
          borderRadius: "50%",
          backgroundColor: "#2970FF",
          bottom: -330,
          right: -230,
          zIndex: -1,
        }}
      />
    </Box>
  );
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export default function ForgotPassword() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    const response = await forgotPassword(data.username);
    if (response.status === 200) {
      enqueueSnackbar("Recovery link sent successfully", { variant: "success" });
    } else {
      enqueueSnackbar("Failed to send recovery link", { variant: "error" });
    }
  };

  return (
    <Page title="Forgot Password">
      <BackgroundCircles></BackgroundCircles>

      <Box
        component="a"
        href="/"
        sx={{
          position: "fixed",
          top: "0.25em",
          right: "0.75em",
          zIndex: 10,
          fontWeight: 600,
          color: "primary.main",
          fontSize: "3.5rem",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
        }}
      >
        <ChevronLeft fontSize="inherit" />
      </Box>

      <Container {...guestContainerLogin}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" },
          }}
          style={guestContainerLoginBox}
        >
          <Box sx={guestContainerLoginSection}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "90%",
                gap: "0.3em",
              }}
            >
              <Typography variant="h4">Forgot your</Typography>
              <Typography
                variant="h1"
                sx={{ color: "primary.main", fontWeight: 700 }}
              >
                Password?
              </Typography>
            </Box>
          </Box>

          <Box sx={guestContainerLoginSection}>
            <Box
              sx={{ ...guestContainerLoginSubsection, alignItems: "center" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={Logo}
                  alt="InfoStudia"
                  sx={{ width: "100%", maxWidth: 50 }}
                />
                <Typography
                  variant="h4"
                  sx={{ color: "primary.main", fontWeight: 700 }}
                >
                  Forgot Password
                </Typography>
              </Box>
              <Typography sx={guestLoginSection}>
                Please type your username in the box below and we will send you a
                recovery link to your linked email.
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} style={guestContainerLoginSubsection}>
              <TextField
                placeholder="Enter your username"
                {...register("username")}
                fullWidth
                variant="outlined"
                size="small"
                InputProps={{
                  sx: { borderRadius: "2em", fontSize: "0.8rem" },
                }}
                label="Username"
                error={!!errors.username}
                helperText={errors.username?.message}
                InputLabelProps={{
                  sx: {
                    fontSize: "0.8rem",
                    "&.Mui-focused": { color: "primary.main" },
                  },
                }}
              />

              <Button sx={guestRoundBlueButton} type="submit">
                Send recovery link
              </Button>
            </form>

            <Box sx={guestContainerLoginSubsection}>
              <Typography sx={guestLoginSection}>
                Remembered your password?{" "}
                <Typography
                  component="span"
                  sx={{
                    ...guestLoginSection,
                    color: "primary.main",
                    fontWeight: 600,
                  }}
                >
                  <Box
                    component="a"
                    href="/auth/login"
                    sx={{
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Back to Login.
                  </Box>
                </Typography>
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Page>
  );
}
