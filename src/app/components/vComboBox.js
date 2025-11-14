"use client";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function CustomComboBox({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        sx={{
          borderRadius: 2,
          backgroundColor: "#ffffff",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ccc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#999",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#000",
          },
          "& .MuiInputLabel-root": {
            color: "#555",
            fontSize: "0.9rem",
          }
        }}
        
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
