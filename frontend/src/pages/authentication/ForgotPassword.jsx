import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

// @mui
import { Box, Button, Container, Typography, Stack } from "@mui/material";
// Routes
import { PATH_AUTH } from "../../routes/path";

// Components
import Page from "../../components/Page";
import { FormProvider, RHFTextField } from "../../components/hook-form";

// Form & Validation
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

// ----------------------------------------------------------------------

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Not a valid email").required("Email is required"),
  });

  const methods = useForm({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: "youremail@student.hcmus.edu.vn" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
      setEmail(data.email);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Page title="Reset Password" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Container sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Box sx={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          {!sent ? (
            <>
              <Typography variant="h3" paragraph>
                Forgot password?
              </Typography>
              <Typography sx={{ color: "text.secondary", mb: 5 }}>
                Please enter the email address associated with your account and we will email you a link to reset your password.
              </Typography>
  
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={3}>
                  <RHFTextField name="email" label="Email address" InputProps={{
                sx: { borderRadius: "16px" },
              }}/>
                  <Button fullWidth size="large" type="submit" variant="contained" loading={isSubmitting} sx={{ borderRadius: "16px" }}>
                    Reset Password
                  </Button>
                </Stack>
              </FormProvider>
  
              <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 2 }}>
                Back
              </Button>
            </>
          ) : (
            <Box>
              <Typography variant="h3" gutterBottom>
                Email sent
              </Typography>
              <Typography>
                We have sent an email to <strong>{email}</strong>.
                <br />
                Please check your inbox.
              </Typography>
  
              <Button size="large" variant="contained" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 5 }}>
                Back to login
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Page>
  );
  
}