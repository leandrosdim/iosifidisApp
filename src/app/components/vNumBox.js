"use client";

import { TextField } from "@mui/material";

export default function CustomNumBox({
  label,
  name,
  value,
  onChange,
  allowFloat = true,
  required = false,
}) {
  // Filter input for numeric-only values
  const handleInput = (e) => {
    let val = e.target.value;

    if (!allowFloat) {
      val = val.replace(/[^\d]/g, ""); // allow only digits
    } else {
      val = val.replace(/[^\d.]/g, ""); // allow digits and one dot
      const parts = val.split(".");
      if (parts.length > 2) {
        val = parts[0] + "." + parts.slice(1).join(""); // remove extra dots
      }
    }

    onChange({
      target: {
        name,
        value: val,
      },
    });
  };

  return (
    <TextField
      variant="outlined"
      type="text"
      label={label}
      name={name}
      value={value}
      onChange={handleInput}
      required={required}
      fullWidth
      sx={{
        backgroundColor: "#ffffff",
        "& input": {
          textAlign: "right",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          "& fieldset": {
            borderColor: "#ccc",
          },
          "&:hover fieldset": {
            borderColor: "#999",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#000",
          },
        },
        "& .MuiInputLabel-root": {
          color: "#555",
        },
      }}
    />
  );
}
