"use client";

import { useEffect, useState } from "react";
import { useCallback } from "react";
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

import { useMessageHandler } from "@/lib/useMessageHandler";

import CustomTextBox from "@/app/components/vTextBox";
import CustomCheckBox from "@/app/components/vCheckBox";
import CustomComboBox from "@/app/components/vComboBox";
import CustomNumBox from "@/app/components/vNumBox";
import CustomButton from "@/app/components/vButton";
import CustomLoading from "@/app/components/vLoading";
import CustomMessage from "@/app/components/vMessage";
import CustomAccordion from "@/app/components/vAccordion";
import CheckAuth from "@/app/components/CheckAuth";
import DeleteConfirmModal from "@/app/components/DeleteModal";
import AddActionModal from "./AddActionModal";

export default function CustomerDetail() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");

  const {
    message,
    messageType,
    showMessage,
    showSuccess,
    showError,
    closeMessage
  } = useMessageHandler();

  const [loading, setLoading] = useState(true);
  const [customerLoaded, setCustomerLoaded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddActionModal, setShowAddActionModal] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phone01: "",
    phone02: "",
    email: "",
    active: true,
    comments: ""
  });
  
  const [customerActions, setCustomerActions] = useState([]);
  const [actionsLoading, setActionsLoading] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  // Redirect if the user is not authorized AFTER rendering
  useEffect(() => {
    if (status !== "loading" && (!session || session.user.level < 99)) {
      router.push("/");
    }
  }, [session, status, router]);
  
  // Fetch customer data when page loads
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/cust/${id}`);
        const data = await res.json();
        if (res.ok && data && data.firstname) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            active: data.active ?? true,
          }));
        } else {
          console.log("Customer not found or error in data format");
          showError('Customer not found or error in data format');
        }
        setCustomerLoaded(true);
      } catch (err) {
        console.error("Error fetching customer:", err);
        showError("Error fetching customer: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && session?.user?.level >= 99) {
      fetchCustomer();
      fetchCustomerActions();
    }
  }, [id, session]);
  
  const fetchCustomerActions = async () => {
    setActionsLoading(true);
    try {
      const res = await fetch(`/api/cust/${id}/actions`);
      const result = await res.json();
      if (result.success) {
        setCustomerActions(result.data);
      } else {
        console.error("Error fetching customer actions:", result.message);
        showError("Error fetching customer actions");
      }
    } catch (err) {
      console.error("Error fetching customer actions:", err);
      showError("Error fetching customer actions: " + err.message);
    } finally {
      setActionsLoading(false);
    }
  };
 

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Show a loading state while checking authentication
  if (status === "loading" || (!session && status !== "loading")) {
    return <CheckAuth />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch(`/api/cust/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (result.success) {
        showSuccess("Changes have saved successfully.");
      } else {
        showError("Error: " + result.error);
      }
    } catch (error) {
      showError("Submission failed: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/cust/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (result.success) {
        router.push("/cust");
      } else {
        showError("Error: " + result.message);
      }
    } catch (err) {
      showError("Deletion failed.");
    }
  };

  const handleAddAction = async (actionData) => {
    try {
      const res = await fetch(`/api/cust/${id}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionData),
      });

      const result = await res.json();
      if (result.success) {
        showSuccess("Action added successfully.");
        // Refresh the actions list
        await fetchCustomerActions();
        return result;
      } else {
        showError("Error adding action: " + result.message);
        return result;
      }
    } catch (error) {
      showError("Error adding action: " + error.message);
      throw error;
    }
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
    <div>
      {status == "authenticated" && session?.user?.level == 100 && (<>
        <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 4, ml: 4 }}>
          <CustomButton
            type="button"
            onClick={() => router.push("/cust")}
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArrowBackIcon fontSize="small" /> Back
          </CustomButton>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -4, mr: 4 }}>
          <CustomButton
            type="button"
            onClick={() => alert("Right action")}
            sx={{
              backgroundColor: "#000",
              color: "#fff",
              textTransform: "none",
              px: 2,
              py: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Do Something
          </CustomButton>
        </Box>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={isMobile ? 2 : 4}>
            {/* Left Column - Customer Information */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: isMobile ? 2 : 4, borderRadius: 3, backgroundColor: '#ffffff' }}>
                <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
                  Edit Customer
                </Typography>

                {loading || !customerLoaded ? (
                  <CustomLoading message="Loading customer..." />
                ) : (
                  <>
                    <Box component="form" onSubmit={handleSubmit}>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <CustomTextBox
                            label="First Name"
                            name="firstname"
                            required
                            value={formData.firstname}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <CustomTextBox
                            label="Last Name"
                            name="lastname"
                            required
                            value={formData.lastname}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomTextBox
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <CustomTextBox
                            label="Phone 1"
                            name="phone01"
                            value={formData.phone01 || ""}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <CustomTextBox
                            label="Phone 2"
                            name="phone02"
                            value={formData.phone02 || ""}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomCheckBox
                            label="Active"
                            name="active"
                            value={formData.active}
                            onChange={handleChange}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <CustomAccordion title="Comments">
                            <CustomTextBox
                              label="Comments"
                              name="comments"
                              value={formData.comments || ""}
                              onChange={handleChange}
                              multiline
                              rows={4}
                            />
                          </CustomAccordion>
                        </Grid>
                        <Grid item xs={12}>
                          <CustomButton type="submit" loading={submitting}>
                            Save Changes
                          </CustomButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                )}
              </Paper>
              
              <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                <IconButton color="error" onClick={() => setShowDeleteModal(true)}>
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
                  <IconButton color="primary" onClick={() => setShowAddActionModal(true)}>
                    <AddIcon />
                  </IconButton>
                </Box>
                
                {actionsLoading ? (
                  <CustomLoading message="Loading customer actions..." />
                ) : customerActions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No actions recorded for this customer yet.
                    </Typography>
                    <CustomButton 
                      variant="outlined" 
                      sx={{ mt: 2 }}
                      onClick={() => setShowAddActionModal(true)}
                    >
                      Add First Action
                    </CustomButton>
                  </Box>
                ) : (
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
                                        {typeof action.metadata === 'object' ? (action.metadata.content || JSON.stringify(action.metadata)) : action.metadata}
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
                )}
              </Paper>
            </Grid>
          </Grid>

          <CustomMessage
            open={showMessage}
            type={messageType}
            message={message}
            onClose={closeMessage}
          />

          <DeleteConfirmModal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Customer?"
            message="Are you sure you want to permanently delete this customer?"
          />
        <AddActionModal
            open={showAddActionModal}
            onClose={() => setShowAddActionModal(false)}
            onSubmit={handleAddAction}
            customerId={id}
          />
        </Container>
      </>
      )}
    </div>
  );
}
