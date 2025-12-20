import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomTextBox from "@/app/components/vTextBox";
import CustomButton from "@/app/components/vButton";

export default function AddActionModal({ open, onClose, onSubmit, customerId }) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [actionTypes, setActionTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    action_type_id: "",
    notes: "",
    metadata: "",
  });

  // Fetch action types when modal opens
  useEffect(() => {
    if (open) {
      fetchActionTypes();
    }
  }, [open]);

  const fetchActionTypes = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would fetch from an API
      // For now, we'll use the static data we know exists
      const staticActionTypes = [
        { id: 1, name: "SMS", description: "Text message sent to customer" },
        { id: 2, name: "Email", description: "Email sent to customer" },
        { id: 3, name: "Call", description: "Phone call with customer" },
        { id: 4, name: "Meeting", description: "In-person or virtual meeting with customer" },
        { id: 5, name: "Note", description: "General note about customer interaction" },
      ];
      setActionTypes(staticActionTypes);
    } catch (error) {
      console.error("Error fetching action types:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.action_type_id) {
      alert("Please select an action type");
      return;
    }
    
    if (!formData.notes.trim()) {
      alert("Please enter notes");
      return;
    }

    // Parse metadata if provided
    let metadata = null;
    if (formData.metadata.trim()) {
      try {
        metadata = JSON.parse(formData.metadata);
      } catch (error) {
        alert("Metadata must be valid JSON");
        return;
      }
    }

    const submitData = {
      action_type_id: parseInt(formData.action_type_id),
      notes: formData.notes,
      metadata: metadata,
    };

    try {
      const response = await onSubmit(submitData);
      if (response?.success) {
        // Reset form and close modal
        setFormData({
          action_type_id: "",
          notes: "",
          metadata: "",
        });
        onClose();
      }
    } catch (error) {
      console.error("Error submitting action:", error);
      alert("Error submitting action: " + error.message);
    }
  };

  const getActionTypeById = (id) => {
    return actionTypes.find(type => type.id === parseInt(id));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-action-modal-title"
      aria-describedby="add-action-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: isMobile ? "90%" : 500,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: isMobile ? 2 : 4,
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography id="add-action-modal-title" variant="h6" component="h2">
            Add New Action
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 2 }}
        >
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="action-type-label">Action Type *</InputLabel>
            <Select
              labelId="action-type-label"
              id="action_type_id"
              name="action_type_id"
              value={formData.action_type_id}
              label="Action Type *"
              onChange={handleChange}
              required
            >
              {actionTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <CustomTextBox
            label="Notes *"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            sx={{ mb: 2 }}
          />

          <CustomTextBox
            label="Metadata (JSON)"
            name="metadata"
            value={formData.metadata}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Optional: Enter additional data in JSON format (e.g., {'content': 'Message content'})"
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <CustomButton type="submit" variant="contained">
              Add Action
            </CustomButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}