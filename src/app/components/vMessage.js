"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CloseIcon from "@mui/icons-material/Close";

export default function CustomMessage({
  open,
  type = "success", // or "error"
  message = "",
  onClose,
}) {
  const isSuccess = type === "success";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box
        position="absolute"
        top={8}
        right={8}
      >
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={3}
        px={2}
      >
        {isSuccess ? (
          <CheckCircleOutlineIcon fontSize="large" color="success" />
        ) : (
          <ErrorOutlineIcon fontSize="large" color="error" />
        )}
        <DialogTitle sx={{ color: isSuccess ? "#4caf50" : "#d32f2f", fontWeight: 600 }}>
          {isSuccess ? "Success" : "Error"}
        </DialogTitle>
        <DialogContent>
        <DialogContentText align="center" sx={{ color: "#333" }}>
            {message}
          </DialogContentText>
        </DialogContent>
      </Box>
    </Dialog>
  );
}
