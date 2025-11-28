"use client"

import { useRouter } from 'next/navigation';

import * as React from 'react';
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


import CustomButton from '@/app/components/vButton';
import CustomTextBox from '@/app/components/vTextBox';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="#">
        created by Leandros Dimitriadis
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function Register() {

  const router = useRouter();
  const [message, setMessage] = React.useState(null);

  const handleSubmit = async (event) => {

    console.log('test1111111');
    event.preventDefault();
    const currentData = new FormData(event.currentTarget);

    const username = currentData.get('username');
    const password = currentData.get('password');
    const lastName = currentData.get('lastName');
    const firstName = currentData.get('firstName');

    try {

      //fetch with endpoind , post request 
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, lastName, firstName }),
      });

      const data = await response.json();

      //check if everything is okay or not
      if (response.ok) {
        setMessage('User created successfully!');
        router.replace('/');
      } else {
        setMessage(data.message); // Assuming the API returns an error message
      }
    } catch (error) {
      setMessage('An error occurred while creating the user.');
      console.error('Error:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme} >
      <Container component="main" maxWidth="xs" sx={{ backgroundColor: "#f4f4f4", minHeight: "100vh", py: 6 }}>
        <CssBaseline />
        <Box
          sx={{
            backgroundColor: "#ffffff",
            p: 4,
            borderRadius: 3,
            boxShadow: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#000", color: "#fff" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 600, color: "#000", mb: 2 }}>
            Welcome new user! Sign up ...
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid2 container spacing={2}>
              <Grid2  size={6}>
                <CustomTextBox
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First name"
                  autoFocus
                />
                
              </Grid2>
              <Grid2 size={6}>
                <CustomTextBox
                  required
                  fullWidth
                  id="lastName"
                  label="Last name"
                  name="lastName"
                  autoComplete="lastName"
                />
              </Grid2>
              <Grid2 size={12}>
                <CustomTextBox
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid2>
              <Grid2 size={12}>
                <CustomTextBox
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid2>             
            </Grid2>            
            <CustomButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt:1,
                backgroundColor: "#000000",
                color: "#ffffff",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#222222"
                }
              }}
            >
              <b>Register</b>
            </CustomButton>
            <Grid2 container justifyContent="flex-end">
              <Grid2 >
                <Link href="/user/login" variant="body2" sx={{ color: "#333", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                  Already have an account? Sign in...
                </Link>
              </Grid2>              
            </Grid2>
            <div style={{ height: '20px' }} />
           
            {message && (
              <Typography
                variant="body1"
                sx={{
                  color: message.startsWith('User created') ? 'green' : 'red',
                  fontWeight: 'bold',
                  textAlign: 'center'
                }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}




