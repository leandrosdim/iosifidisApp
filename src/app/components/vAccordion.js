"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CustomAccordion({
  title = "Section",
  children,
  defaultExpanded = false,
}) {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      sx={{
        borderRadius: 2,
        backgroundColor: "#fafafa",
        border: "1px solid #ccc",
        boxShadow: "none",
        mb: 2,
        "&:hover": {
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
        },
        "&::before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: "#000" }} />}
        sx={{
          backgroundColor: "#f4f4f4",
          fontWeight: 600,
          px: 2,
          py: 1,
        }}
      >
        <Typography sx={{ color: "#333", fontWeight: 500 }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, py: 1 }}>
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
}
