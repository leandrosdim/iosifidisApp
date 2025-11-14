"use client";

import { Modal, Box, Typography, Button, Stack } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { keyframes } from "@mui/system";

const shake = keyframes`
  10%, 90% { transform: translate(-50%, -50%) translateX(-1px); }
  20%, 80% { transform: translate(-50%, -50%) translateX(2px); }
  30%, 50%, 70% { transform: translate(-50%, -50%) translateX(-4px); }
  40%, 60% { transform: translate(-50%, -50%) translateX(4px); }
`;

export default function DeleteConfirmModal({ open, onClose, onConfirm, title = "Are you sure?", message }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 380,
          bgcolor: "#fff3f3",
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          animation: `${shake} 0.6s ease`,
          border: "2px solid #d32f2f",
        }}
      >
        <WarningAmberIcon sx={{ fontSize: 60, color: "#d32f2f", mb: 1 }} />
        <Typography variant="h6" fontWeight={700} color="#b71c1c" mb={1}>
          {title}
        </Typography>
        <Typography variant="body2" color="#444" mb={3}>
          {message || "This action cannot be undone."}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button onClick={onClose} variant="outlined" sx={{ borderColor: "#999", color: "#555" }}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Delete
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
