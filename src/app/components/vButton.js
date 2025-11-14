"use client";

import { Button } from "@mui/material";

export default function CustomButton({ children, loading = false, ...props }) {
  return (
    <Button
      variant="contained"
      disableElevation
      disabled={loading || props.disabled}
      sx={{
        textTransform: "none",
        borderRadius: 2,
        fontWeight: 500,
        px: 4,
        py: 1.5,
        backgroundColor: "#000000",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#222222",
        },
        "&:disabled": {
          backgroundColor: "#888",
        },
      }}
      
      {...props}
    >
      {loading ? "Loading..." : children}
    </Button>
  );
}
