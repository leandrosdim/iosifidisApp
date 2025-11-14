"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Card,
  CardContent,
  TextField,
  Grid2,
  Modal
} from "@mui/material";
import Link from "next/link";

import CustomButton from "@/app/components/vButton";
import CustomTextBox from "@/app/components/vTextBox";


const ProfilePage = () => {
  const { data: session } = useSession();
  const [error, setError] = useState("");
  const [message,setMessage]= useState("");
  const [user, setUser] = useState({
    username: "",
    firstname: "",
    lastname: "",
    level: "",
    email: "",
    phone: ""
  });

  // ✅ State for change password modal
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // ✅ Update user state when session is available
  useEffect(() => {
    if (session) {
      setUser({
        username: session.user.username || "",
        firstname: session.user.firstname || "",
        lastname: session.user.lastname || "",
        level: session.user.level || "",
        email: session.user.email || "",
        phone: session.user.phone || ""
      });
    }
  }, [session]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  // ✅ Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      const response = await fetch("/api/auth/updateProf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || "Failed to update profile.");
      } else {
        setMessage("Profile updated successfully!"); // ✅ Show success message
        setTimeout(() => setMessage(""), 5000); // ✅ Remove message after 5 seconds
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("An error occurred while updating your profile.");
    }
  };
  

  // ✅ Handle password input changes
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Handle password update submission
const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (passwords.newPassword !== passwords.confirmPassword) {
    setError("New passwords do not match.");
    return;
  }

  try {
    const response = await fetch("/api/auth/updatePass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Failed to update password.");
    } else {
      setPasswordModalOpen(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setMessage("Password changed successfully"); // ✅ Show success message
      setTimeout(() => setMessage(""), 5000); // ✅ Remove message after 5 seconds      
      
    }
  } catch (error) {
    console.error("Password update failed:", error);
    setError("An error occurred while updating your password.");
  }
};


  if (!session) {
    return (
      <Container maxWidth="sm">
        <Box textAlign="center" mt={5}>
          <Typography variant="h5">You are not logged in</Typography>
          <CustomButton variant="contained" color="primary" component={Link} href="/users/login" >
            Login
          </CustomButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5, backgroundColor: "#f4f4f4", minHeight: "100vh", py: 4 }}>
      <Card sx={{
        p: 4,
        borderRadius: 3,
        backgroundColor: "#ffffff",
        boxShadow: 4
      }}>
        <Avatar src={session.user.image || ""} alt={user.firstname} sx={{ width: 80, height: 80, margin: "auto", border: "2px solid #000" }}/>
        <CardContent>
          <Typography variant="h5" fontWeight={600} mt={2} mb={3} color="#000">
            Your Profile
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid2 container spacing={2}>
              <Grid2 size={6}>
                <CustomTextBox margin="normal" required fullWidth id="username" label="Username" name="username" value={user.username} disabled />
              </Grid2>
              <Grid2 size={6}>
                <CustomTextBox margin="normal" required fullWidth id="level" label="Level" name="level" value={user.level} disabled />
              </Grid2>
            </Grid2>

            <CustomTextBox margin="normal" required fullWidth name="firstname" label="First Name" id="firstname" value={user.firstname} onChange={handleChange} />
            <CustomTextBox margin="normal" required fullWidth name="lastname" label="Last Name" id="lastname" value={user.lastname} onChange={handleChange} />
            <CustomTextBox margin="normal" required fullWidth name="email" label="E-mail" id="email" value={user.email} onChange={handleChange} />
            <CustomTextBox margin="normal" required fullWidth name="phone" label="Phone" id="phone" value={user.phone} onChange={handleChange} />

            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
             {message && (
              <Typography variant="body2" color="success" align="center">
                {message}
              </Typography>
            )}

            <Grid2 container spacing={3}>
              <Grid2 size={6}>
                <CustomButton
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#222"
                    }
                  }}
                >
                  <b>Update Profile</b>
                </CustomButton>
              </Grid2>
              <Grid2 size={6}>
                <CustomButton
                  fullWidth
                  variant="outlined"
                  onClick={() => setPasswordModalOpen(true)}
                  sx={{
                    borderColor: "#555",
                    color: "#555",
                    "&:hover": {
                      backgroundColor: "#eee"
                    }
                  }}
                >
                  Change Password
                </CustomButton>
              </Grid2>
            </Grid2>
            
        
            
           
          </Box>
        </CardContent>
      </Card>

      {/* ✅ Change Password Modal */}
      <Modal open={isPasswordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#ffffff",
            color: "#000",
            boxShadow: 24,
            p: 4,
            borderRadius: 3
          }}
        >
          <Typography variant="h6" textAlign="center" mb={2}>
            Change Password
          </Typography>
          <Box component="form" onSubmit={handlePasswordSubmit}>
            <CustomTextBox
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
            />
            <CustomTextBox
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
            <CustomTextBox
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
            {error && (
              <Typography variant="body2" color="error" align="center">
                {error}
              </Typography>
            )}
            {message && (
              <Typography variant="body2" color="green" align="center">
                {message}
              </Typography>
            )}
            <CustomButton type="submit" fullWidth variant="contained"  sx={{ backgroundColor: "#000", color: "#fff", mb: 2 }}>
              Update Password
            </CustomButton>
            <CustomButton fullWidth variant="outlined"  onClick={() => setPasswordModalOpen(false)}  sx={{ borderColor: "#999", color: "#999" }}>
              Cancel
            </CustomButton>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
