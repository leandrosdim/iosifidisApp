"use client";

import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default function CheckAuth() {
  return (
    <Backdrop
      open={true}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: "#fff",
        flexDirection: "column",
      }}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" mt={2}>
        Checking authentication...
      </Typography>
    </Backdrop>
  );
}
