import * as Yup from "yup";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// @mui
import {
  Container,
  Typography,
  Link,
  IconButton,
  InputAdornment,
  Stack,
  Button
} from "@mui/material";
// components
import Page from "../../components/Page";
import {
  FormProvider,
  RHFSwitch,
  RHFTextField,
} from "../../components/hook-form";
import Iconify from "../../components/Iconify";
// routes
import { PATH_AUTH } from "../../routes/path";
// ----------------------------------------------------------------------
export default function Login() {
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const defaultValues = {
    username: "",
    password: "",
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const onSubmit = async (data) => {
    try {
      //   await login(data.username, data.password); // this code for jwt
      console.log(data);
    } catch (error) {
      console.log(error.response);
      enqueueSnackbar(error.response.data, { variant: "error" });
    }
  };
  return (
    <Page title="Log in" sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Container maxWidth="sm" >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }} textAlign={"center"}>
          Log in to your account
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
            Enter your details below
        </Typography>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField
              name="username"
              label="Username"
              InputProps={{
                sx: { borderRadius: "16px" },
              }}
            />

            <RHFTextField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              InputProps={{
                sx: { borderRadius: "16px" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            <RHFSwitch name="remember" label="Remember me" />
            <Link
              component={RouterLink}
              variant="subtitle2"
              to={PATH_AUTH.forgotPassword}
            >
              Forgot password?
            </Link>
          </Stack>

          <Button
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ borderRadius: "16px" }}
          >
            Log in
          </Button>
        </FormProvider>
      </Container>
    </Page>
  );
}
