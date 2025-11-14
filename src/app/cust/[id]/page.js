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
  Grid2,
  IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";



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


export default function CustomerDetail() {
  const { id } = useParams();
  const { data: session, status } = useSession();
  const router = useRouter(); // Initialize router

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


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    active: "",
    startedYear: '',
    comments: ''
  });
  const [submitting, setSubmitting] = useState(false);



  // Redirect if the user is not authorized AFTER rendering
  useEffect(() => {
    if (status !== "loading" && (!session || session.user.level !== 100)) {
      router.push("/");
    }
  }, [session, status, router]);
  // Fetch customer data when page loads
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/cust/${id}`);
        const data = await res.json();
        if (data && data.name) {
          setFormData((prev) => ({
            ...prev,
            ...data,
            age: data.age ?? "", // ✅ 
            startedYear: String(data.startedYear ?? ""),
          }));

        } else {
          console.log("Customer not found or error in data format");
          showError('Customer not found or error in data format');
        }
        setCustomerLoaded(true); // ✅ always set it at the end
      } catch (err) {
        console.error("Error fetching customer:", err);
        showError("Error fetching customer: " + err.message);
      } finally {
        setLoading(false);

      }
    };

    if (id && session?.user?.level == 100) {
      fetchCustomer();
    }
  }, [id, session]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        method: "PUT", // Use PUT for updates
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

        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#ffffff' }}>
            <Typography variant="h4" gutterBottom style={{ fontWeight: 600 }}>
              Edit Customer
            </Typography>

            {loading || !customerLoaded ? (
              <CustomLoading message="Loading customer..." />
            ) : (
              <>
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid2 container spacing={3}>
                    <Grid2 size={5}>
                      <CustomTextBox
                        label="Name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Grid2>
                    <Grid2 size={3}>
                      <CustomNumBox
                        label="Age"
                        name="age"
                        value={formData.age ?? ""}
                        onChange={handleChange}
                        allowFloat={false}
                      />
                    </Grid2>
                    <Grid2 size={3}>
                      <CustomCheckBox
                        label="Active"
                        name="active"
                        value={formData.active || 0}
                        onChange={handleChange}
                      />
                    </Grid2>
                    <Grid2 size={12}>
                      <CustomTextBox
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                      />
                    </Grid2>
                    <Grid2 size={12}>
                      <CustomTextBox
                        label="Phone"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                      />
                    </Grid2>
                    <Grid2 size={12}>
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
                    </Grid2>
                    <Grid2 size={5}>
                      <CustomComboBox
                        label="Started at"
                        name="startedYear"
                        value={formData.startedYear}
                        onChange={handleChange}
                        options={[
                          { label: "2021", value: "2021" },
                          { label: "2022", value: "2022" },
                          { label: "2023", value: "2023" },
                          { label: "2024", value: "2024" },
                          { label: "2025", value: "2025" },
                        ]}
                      />
                    </Grid2>
                    <Grid2 size={5}>
                      <CustomButton type="submit" loading={submitting}
                      >
                        Save
                      </CustomButton>
                    </Grid2>
                  </Grid2>


                </Box>


                <CustomMessage
                  open={showMessage}
                  type={messageType}
                  message={message}
                  onClose={closeMessage}
                />

              </>
            )}

          </Paper>
          <Box sx={{ mt: 6, display: "flex", justifyContent: "flex-end" }}>
            {/* <CustomButton
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Customer
            </CustomButton> */}
            <IconButton color="error" onClick={() => setShowDeleteModal(true)}>
              <DeleteIcon />
            </IconButton>
          </Box>
          <DeleteConfirmModal
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleDelete}
            title="Delete Customer?"
            message="Are you sure you want to permanently delete this customer?"
          />

        </Container>
      </>
      )}
    </div>
  );
}
