"use client";

import { Box, CircularProgress, Typography } from "@mui/material";

export default function CustomLoading({ message = "Loading..." }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="200px"
      width="100%"
    >
      <CircularProgress size={40} sx={{ color: "#000" }} />
      <Typography mt={2} color="#555">
        {message}
      </Typography>
    </Box>
  );
}
