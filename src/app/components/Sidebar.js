"use client";

import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Icon } from "@mui/material";
import { logOutOutline, personCircleOutline } from "ionicons/icons";

import {
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Avatar,
  Menu,
  MenuItem
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession(); // ✅ Get user session
  const [anchorEl, setAnchorEl] = useState(null); // ✅ State for dropdown menu
  const isMenuOpen = Boolean(anchorEl);

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setOpen(open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  let menuItems = [];

  if (session && session.user.level == 100) {
    menuItems = [
      { text: "Home", href: "/" },
      { text: "Customers", href: "/cust" },
      { text: "Programs", href: "/training-programs" },
      { text: "Calendar", href: "/calendar" },
      { text: "Payments", href: "/payments" },
    ];
  } else if (session && session.user.level < 100 && session.user.level > 9) {
    menuItems = [
      { text: "Home", href: "/" },
      { text: "Programs", href: "/training-programs" },
      { text: "Calendar", href: "/calendar" },
    ];
  } else if (session && session.user.level < 9) {
    menuItems = [
      { text: "Home", href: "/" },
      { text: "Programs", href: "/training-programs" },
    ];
  } else {
    menuItems = [
      { text: "Home", href: "/" },

    ];
  }








  return (
    <>
      {/* Top Navbar */}
      <AppBar position="static" sx={{ backgroundColor: "#000000" }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{
            flexGrow: 1,
            fontFamily: "'Great Vibes', cursive", // <-- calligraphy font here
            fontWeight: 600,
            color: "#ffffff",
          }}>
            Anastasia Personal Trainer
          </Typography>

          {/* User Authentication Section */}
          {session ? (
            <>
              <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                <Avatar src={session.user.image || ""} alt={session.user.firstname} sx={{ width: 36, height: 36, border: "2px solid white" }} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                      backgroundColor: "#2a2a2a",
                      color: "#fff",
                    },
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose} disabled>
                  {session.user.firstname || "User first name"} {session.user.lastname || "User last name"}
                </MenuItem>
                <MenuItem onClick={() => { window.location.href = "/users/profile"; }}>
                  <Icon sx={{ fontSize: 20, marginRight: 1 }}>
                    <img src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.5.2/svg/person-circle-outline.svg" alt="profile" width="20" />
                  </Icon>
                  Profile
                </MenuItem>
                <MenuItem onClick={signOut}>
                  <Icon sx={{ fontSize: 20, marginRight: 1 }}>
                    <img src="https://cdnjs.cloudflare.com/ajax/libs/ionicons/5.5.2/svg/log-out-outline.svg" alt="logout" width="20" />
                  </Icon>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                color="inherit"
                component={Link}
                href="/users/login"
                sx={{
                  borderColor: "#ffffff",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "#333333" },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                href="/users/signup"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  "&:hover": {
                    backgroundColor: "#dddddd",
                  },
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)} PaperProps={{
        sx: {
          backgroundColor: "#1e1e1e",
          color: "#ffffff",
        },
      }}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {menuItems.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton component={Link} href={item.href}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
