"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Icon } from "@mui/material";
import { logOutOutline, personCircleOutline } from "ionicons/icons";

import {
  AppBar,
  Toolbar,
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
  MenuItem,
  Divider,
} from "@mui/material";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import SmsIcon from "@mui/icons-material/Sms";
import GroupIcon from "@mui/icons-material/Group";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TimelineIcon from "@mui/icons-material/Timeline";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession(); // ✅ Get user session
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentPath, setCurrentPath] = useState("/");

  const isMenuOpen = Boolean(anchorEl);
  const level = session?.user?.level ?? 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
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

  // ---- Menu items depending on level ----
  const baseItems = [
    {
      text: "Dashboard",
      href: "/",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      text: "Customers",
      href: "/cust", // keep your existing /cust route
      icon: <GroupIcon fontSize="small" />,
    },
  ];

  const midItems =
    level >= 10
      ? [
          {
            text: "Leads",
            href: "/leads",
            icon: <TimelineIcon fontSize="small" />,
          },
          {
            text: "SMS",
            href: "/sms",
            icon: <SmsIcon fontSize="small" />,
          },
        ]
      : [];

  const adminItems =
    level >= 100
      ? [
          {
            text: "Admin",
            href: "/admin",
            icon: <SettingsIcon fontSize="small" />,
          },
        ]
      : [];

  const menuItems = [...baseItems, ...midItems, ...adminItems];

  const getRoleLabel = () => {
    if (level >= 100) return "Admin";
    if (level >= 10) return "Power user";
    return "User";
  };

  const renderNavItem = (item) => {
    const active = currentPath === item.href;

    return (
      <ListItem key={item.href} disablePadding>
        <ListItemButton
          component={Link}
          href={item.href}
          sx={{
            px: 2.5,
            py: 1,
            borderRadius: "999px",
            mx: 1.5,
            my: 0.5,
            "&.MuiButtonBase-root": {
              minHeight: 40,
            },
            backgroundColor: active
              ? "var(--color-primary-soft)"
              : "transparent",
            color: active ? "var(--color-primary)" : "var(--color-shell-text)",
            "&:hover": {
              backgroundColor: active
                ? "var(--color-primary-soft)"
                : "rgba(148, 163, 184, 0.12)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "999px",
                backgroundColor: active
                  ? "var(--color-primary)"
                  : "rgba(15, 23, 42, 0.6)",
              }}
            >
              {item.icon}
            </Box>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: active ? 600 : 500,
              }}
            />
          </Box>
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <>
      {/* Top App Shell */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "var(--color-shell)",
          color: "var(--color-shell-text)",
          borderBottom: "1px solid var(--color-border-subtle)",
          borderRadius: '15px'
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          {/* Burger menu for mobile / PWA */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open navigation"
            onClick={toggleDrawer(true)}
            sx={{ mr: 0.5 }}
          >
            <MenuIcon />
          </IconButton>

          {/* App brand */}
          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.3,
                fontSize: 16,
                lineHeight: 1.1,
                fontFamily: "var(--font-sans)",
              }}
            >
              Iosifidis CRM
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "var(--color-text-muted)",
                opacity: 0.9,
              }}
            >
              Customer & SMS console
            </Typography>
          </Box>

          {/* Right side (user / login) */}
          {session ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  textAlign: "right",
                  display: { xs: "none", sm: "block" },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {session.user.firstname} {session.user.lastname}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: 11,
                    color: "var(--color-text-muted)",
                  }}
                >
                  {getRoleLabel()}
                </Typography>
              </Box>

              <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                <Avatar
                  src={session.user.image || ""}
                  alt={session.user.firstname || "User"}
                  sx={{
                    width: 34,
                    height: 34,
                    border: "2px solid rgba(148, 163, 184, 0.6)",
                  }}
                />
              </IconButton>

              {/* Profile dropdown */}
              <Menu
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1,
                      minWidth: 190,
                      bgcolor: "var(--color-surface)",
                      color: "var(--color-text-main)",
                      boxShadow: "var(--shadow-soft)",
                      borderRadius: "var(--radius-card)",
                    },
                  },
                }}
              >
                <MenuItem disabled>
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography variant="body2">
                      {session.user.firstname} {session.user.lastname}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "var(--color-text-muted)" }}
                    >
                      {session.user.email}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    window.location.href = "/users/profile";
                  }}
                >
                  <AccountCircleIcon
                    fontSize="small"
                    style={{ marginRight: 8 }}
                  />
                  Profile
                </MenuItem>
                <MenuItem onClick={signOut}>
                  <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                color="inherit"
                size="small"
                component={Link}
                href="/users/login"
                sx={{
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid rgba(148, 163, 184, 0.6)",
                  px: 1.5,
                  "&:hover": {
                    backgroundColor: "rgba(15, 23, 42, 0.6)",
                  },
                }}
              >
                <Typography variant="body2">Login</Typography>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Left Drawer Sidebar */}
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: "var(--color-shell)",
            color: "var(--color-shell-text)",
            borderRight: "1px solid var(--color-border-subtle)",
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            px: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            height: "100%",
          }}
          role="presentation"
          onKeyDown={toggleDrawer(false)}
        >
          {/* User block inside drawer */}
          {session && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 0.5,
              }}
            >
              <Avatar
                src={session.user.image || ""}
                alt={session.user.firstname || "User"}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(148, 163, 184, 0.6)",
                }}
              />
              <Box sx={{ overflow: "hidden" }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 500, fontSize: 14 }}
                >
                  {session.user.firstname} {session.user.lastname}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  sx={{ color: "var(--color-text-muted)", fontSize: 11 }}
                >
                  {session.user.email}
                </Typography>
              </Box>
            </Box>
          )}

          <Divider
            sx={{
              borderColor: "rgba(15, 23, 42, 0.9)",
              my: 1,
            }}
          />

          {/* Navigation section */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="overline"
              sx={{
                px: 2,
                letterSpacing: 1,
                fontSize: 11,
                color: "var(--color-text-muted)",
              }}
            >
              NAVIGATION
            </Typography>
            <List sx={{ mt: 0.5 }}>{menuItems.map(renderNavItem)}</List>
          </Box>

          {/* Bottom logout shortcut */}
          {session && (
            <Box sx={{ mt: "auto" }}>
              <Divider
                sx={{
                  borderColor: "rgba(15, 23, 42, 0.9)",
                  mb: 1,
                }}
              />
              <List dense>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={signOut}
                    sx={{
                      px: 2,
                      borderRadius: "999px",
                      mx: 1,
                      "&:hover": {
                        backgroundColor: "rgba(248, 113, 113, 0.08)",
                      },
                    }}
                  >
                    <LogoutIcon fontSize="small" style={{ marginRight: 8 }} />
                    <ListItemText
                      primary="Logout"
                      primaryTypographyProps={{ fontSize: 13 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
