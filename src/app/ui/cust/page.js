"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Container,
  Typography,
  Box,
  Stack,
  Modal,
  useMediaQuery,
} from "@mui/material";

import { useMessageHandler } from "@/lib/useMessageHandler";

import CustomTextBox from "@/app/components/vTextBox";
import CustomButton from "@/app/components/vButton";
import CustomMessage from "@/app/components/vMessage";
import CheckAuth from "@/app/components/CheckAuth";

import CustomersTableDesktop from "./CustomersTableDesktop";
import CustomersListMobile from "./CustomersListMobile";


export default function CustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Customer modal
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const {
    message,
    messageType,
    showMessage,
    showSuccess,
    showError,
    closeMessage,
  } = useMessageHandler();

  // Redirect non-admins
  useEffect(() => {
    if (status !== "loading" && (!session || session.user.level !== 100)) {
      router.push("/");
    }
  }, [session, status, router]);

  // Fetch customers
  useEffect(() => {
    if (session?.user?.level === 100) {
      fetchCustomers();
    }
  }, [session]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/cust");
      const result = await response.json();
      if (result.success) {
        setCustomers(result.data);
      } else {
        console.error("Error fetching customers:", result.error);
        showError("Δεν φορτώθηκαν οι πελάτες.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showError("Σφάλμα κατά τη φόρτωση πελατών.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    router.push(`/cust/${id}`);
  };

  const handleAddCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const result = await res.json();
      if (result.success) {
        showSuccess("New customer added with name: " + result.data.name);
        setOpen(false);
        setName("");
        await fetchCustomers();
      } else {
        showError("Error: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      showError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // While auth is resolving
  if (status === "loading" || (!session && status !== "loading")) {
    return <CheckAuth />;
  }

  return (
    <Container maxWidth = 'xl' sx={{ mt: 3, mb: 4 }}>
      {/* Top bar */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h5"
          sx={{
            color: "var(--color-text-main)",
            fontWeight: 600,
          }}
        >
          Customers
        </Typography>

        <CustomButton
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: "var(--color-primary)",
            "&:hover": { backgroundColor: "var(--color-primary-hover)" },
            paddingX: 2.5,
          }}
        >
          + Add
        </CustomButton>
      </Stack>

      {/* Card wrapper for table/list */}
      <Box
        sx={{
          width: "100%",
          backgroundColor: "var(--color-surface)",
          borderRadius: "var(--radius-card)",
          boxShadow: "var(--shadow-soft)",
          border: "1px solid var(--color-border-subtle)",
          overflow: "hidden",
        }}
      >
        {isMobile ? (
          <CustomersListMobile
            customers={customers}
            loading={loading}
            onRowClick={handleRowClick}
          />
        ) : (
          <CustomersTableDesktop
            customers={customers}
            loading={loading}
            onRowClick={handleRowClick}
          />
        )}
      </Box>

      {/* Add Customer Modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setName("");
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "90vw" : 400,
            bgcolor: "var(--color-surface)",
            boxShadow: "var(--shadow-soft)",
            borderRadius: "var(--radius-card)",
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            mb={2}
            sx={{
              color: "var(--color-text-main)",
              fontWeight: 600,
            }}
          >
            Add New Customer
          </Typography>

          <Stack spacing={2}>
            <CustomTextBox
              label="Name"
              name="name"
              value={name}
              fullWidth
              required
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />

            <CustomButton
              type="submit"
              variant="contained"
              onClick={handleAddCustomer}
              disabled={loading || !name}
              sx={{
                backgroundColor: "var(--color-primary)",
                "&:hover": { backgroundColor: "var(--color-primary-hover)" },
              }}
            >
              {loading ? "Adding..." : "Add"}
            </CustomButton>
          </Stack>
        </Box>
      </Modal>

      <CustomMessage
        open={showMessage}
        type={messageType}
        message={message}
        onClose={closeMessage}
      />
    </Container>
  );
}
