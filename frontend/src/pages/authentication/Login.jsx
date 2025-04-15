import {useContext } from "react";
import { AuthContext } from "../../contexts/JWTContext";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "framer-motion";
// hooks
import useResponsive from "../../hooks/useResponsive";
// @mui
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
// components
import Page from "../../components/Page";
import Logo from "../../assets/Logo.svg";
import {
  guestContainerLogin,
  guestContainerLoginBox,
  guestContainerLoginSection,
  guestContainerLoginSubsection,
  guestLoginSection,
  guestRoundBlueButton,
} from "../../assets/styles/guest";
import { loginApi} from "../../utils/api";
import { useSnackbar } from "notistack"
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
          bottom: -450,
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
          top: -330,
          right: -230,
          zIndex: -1,
        }}
      />
    </Box>
  );
}

const loginSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required"),
  password: Yup.string()
    .required("Password is required"),
});

// ----------------------------------------------------------------------

export default function Login() {
  const isDesktop = useResponsive("up", "lg");
  const { login } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await loginApi({username: data.username, password: data.password});
      console.log("Login response:", response);
        console.log("Login successful:", response.data);
        login(response.data.accessToken, response.data.user);
        window.location.href = `/${response.data.user.role}`;
    } catch (error) {
      enqueueSnackbar(error.response.data.message, { variant: "error" });
      console.error("Login error:", error);
      // Handle error (e.g., show a notification)
    }
  };

  return (
    <Page title="Login">
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
          color: "primary.lighter",
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
          {isDesktop && (
            <Box sx={guestContainerLoginSection}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "90%",
                  gap: "0.3em",
                }}
              >
                <Typography
                  variant="h1"
                  sx={{ color: "primary.main", fontWeight: 700 }}
                >
                  Login
                </Typography>
                <Typography variant="h4">to your institute.</Typography>
              </Box>
            </Box>
          )}
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
                  Login
                </Typography>
              </Box>
              <Typography sx={guestLoginSection}>
                Please use the email and password that your organization
                provided to log in to your account.
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
                  name="username"
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  InputLabelProps={{
                    sx: {
                      fontSize: "0.8rem",
                      "&.Mui-focused": { color: "primary.main" },
                    },
                  }}
                />

                <TextField
                  placeholder="Enter your password"
                  {...register("password")}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: { borderRadius: "2em", fontSize: "0.8rem" },
                  }}
                  label="Password"
                  name="password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputLabelProps={{
                    sx: {
                      fontSize: "0.8rem",
                      "&.Mui-focused": { color: "primary.main" },
                    },
                  }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        sx={{
                          color: "primary.main",
                          "&.Mui-checked": { color: "primary.main" },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.8rem" }}>
                        Remember Me
                      </Typography>
                    }
                  ></FormControlLabel>
                  <Typography
                    component="a"
                    href="/auth/forgot-password"
                    sx={{
                      fontSize: "0.8rem",
                      textDecoration: "none",
                      color: "primary.main",
                      fontWeight: 600,
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Forgot Password
                  </Typography>
                </Box>

                <Button sx={guestRoundBlueButton} type="submit">
                  Login
                </Button>

            </form>

            <Box component="div" sx={guestContainerLoginSubsection}>
                <Typography sx={guestLoginSection}>
                  Don’t have an account?
                  <Typography
                    sx={{
                      ...guestLoginSection,
                      color: "primary.main",
                      fontWeight: 600,
                    }}
                  >
                    Contact your Student Affairs Office.
                  </Typography>
                </Typography>
              </Box>
          </Box>

        </motion.div>

      </Container>

    </Page>
  );
}
