// Test component to verify the layout works correctly
// This is just for testing purposes and won't be used in the actual application

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  useMediaQuery,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import SmsIcon from "@mui/icons-material/Sms";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import GroupsIcon from "@mui/icons-material/Groups";
import NoteIcon from "@mui/icons-material/Note";
import AddIcon from "@mui/icons-material/Add";

export default function TestCustomerDetail() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");
  
  // Mock data for testing
  const [formData, setFormData] = useState({
    firstname: "John",
    lastname: "Smith",
    phone01: "555-0101",
    phone02: "555-0102",
    email: "john.smith@email.com",
    active: true,
    comments: "Regular customer"
  });
  
  const [customerActions, setCustomerActions] = useState([
    {
      id: 1,
      action_type: "SMS",
      timestamp: "2025-12-20T10:10:12.059Z",
      notes: "Welcome SMS sent to new customer",
      metadata: { content: "Welcome to our service!" }
    },
    {
      id: 2,
      action_type: "Email",
      timestamp: "2025-12-19T15:30:00.000Z",
      notes: "Follow-up email after initial contact",
      metadata: { subject: "Thank you for joining us" }
    },
    {
      id: 3,
      action_type: "Call",
      timestamp: "2025-12-18T09:15:00.000Z",
      notes: "Initial consultation call",
      metadata: { duration: "15 minutes" }
    }
  ]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'SMS':
        return <SmsIcon />;
      case 'Email':
        return <EmailIcon />;
      case 'Call':
        return <PhoneIcon />;
      case 'Meeting':
        return <GroupsIcon />;
      case 'Note':
        return <NoteIcon />;
      default:
        return <NoteIcon />;
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'SMS':
        return 'primary';
      case 'Email':
        return 'secondary';
      case 'Call':
        return 'info';
      case 'Meeting':
        return 'success';
      case 'Note':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={isMobile ? 2 : 4}>
        {/* Left Column - Customer Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3, backgroundColor: '#ffffff' }}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
              Edit Customer
            </Typography>

            <Box component="form">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <input
                    label="First Name"
                    name="firstname"
                    required
                    value={formData.firstname}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input
                    label="Last Name"
                    name="lastname"
                    required
                    value={formData.lastname}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input
                    label="Phone 1"
                    name="phone01"
                    value={formData.phone01 || ""}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <input
                    label="Phone 2"
                    name="phone02"
                    value={formData.phone02 || ""}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <label>
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    Active
                  </label>
                </Grid>
                <Grid item xs={12}>
                  <textarea
                    label="Comments"
                    name="comments"
                    value={formData.comments || ""}
                    onChange={handleChange}
                    rows={4}
                    style={{ width: '100%', padding: '8px', margin: '4px 0' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <button type="submit" style={{ padding: '8px 16px' }}>
                    Save Changes
                  </button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
          
          <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Grid>

        {/* Right Column - Customer Actions */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3, backgroundColor: '#ffffff', height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
                Customer Actions
              </Typography>
              <IconButton color="primary">
                <AddIcon />
              </IconButton>
            </Box>
            
            <Card variant="outlined">
              <CardContent>
                <List>
                  {customerActions.map((action) => (
                    <Box key={action.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemIcon>
                          <Chip 
                            icon={getActionIcon(action.action_type)} 
                            label={action.action_type} 
                            color={getActionColor(action.action_type)}
                            size="small"
                            variant="outlined"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={action.notes}
                          secondary={
                            <>
                              <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                              >
                                {new Date(action.timestamp).toLocaleString()}
                              </Typography>
                              {action.metadata && (
                                <Typography
                                  sx={{ display: 'block', mt: 1 }}
                                  component="span"
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {action.metadata.content || JSON.stringify(action.metadata)}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}