"use client"

import * as React from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Grid2, { grid2Classes as classes } from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import CustomTextBox from '@/app/components/vTextBox';
import CustomButton from '@/app/components/vButton';

function SignIn() {
  const router = useRouter();
  const [error, setError] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    //save the creadentials from user's form
    const data = new FormData(event.currentTarget);
    const username = data.get('username');
    const password = data.get('password');

    //go for jwt token with signIn function from next-auth (αυτόματα ψάχνει αρχείο /api/auth/[...nextauth].js)
    const result = await signIn('credentials', {
      redirect: false,
      username: username,
      password: password,
    });

    //redirect if no error / message if error
    if (!result.error) {
      //router.replace('/user/profile');
      router.replace('/dashboard');
    } else {
      // Set error state to display error message to the user
      setError('Invalid email or password. Please try again.');
      console.log(result.error);
    }
  };

  return (
    <ThemeProvider theme={createTheme()} sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh" }}>
      <Container component="main" maxWidth="xs" >
        <CssBaseline />
        <Box
          sx={{
            mt: 8,
            p: 4,
            backgroundColor: "#ffffff",
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#000000", color: "#ffffff" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ color: "#000000", fontWeight: 600 }}>
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <CustomTextBox
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <CustomTextBox
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                mb: 2,
                backgroundColor: "#000000",
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "#222222",
                },
              }}
            >
              <b>Login</b>
            </CustomButton>
            <Grid2 container>
              <Grid2 style={{ textAlign: "left" }} size={12}>
                <Link href="#" variant="body2" sx={{ color: "#333" }}>
                  Forgot Password ?
                </Link>
              </Grid2>
              
              <Grid2  style={{ textAlign: "right" }} size={12}>
                <Link href="/users/signup" variant="body2"  sx={{ color: "#333" }}>
                  {"Don't have an account? Sign up"}
                </Link>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
