"use client";

import { Checkbox, FormControlLabel } from "@mui/material";

export default function CustomCheckBox({ label, name, value, onChange }) {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={value === 1}
          onChange={(e) => onChange({ target: { name, value: e.target.checked ? 1 : 0 } })}
          sx={{
            color: "#999",
            "&.Mui-checked": {
              color: "#000", // black when checked
            },
          }}
          
        />
      }
      label={label}
      sx={{ ml: 1 }}
    />
  );
}
