"use client";

import { TextField } from "@mui/material";

export default function CustomTextBox(props) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      slotProps={{
        inputLabel: { shrink: true }, // ✅ New way to handle shrink
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          backgroundColor: "#ffffff",
          "&:hover fieldset": {
            borderColor: "#999",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#000",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#555",
          fontSize: "0.9rem",
        },
      }}
      {...props}
    />
  );
}
