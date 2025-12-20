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
import useDebounce from "@/lib/useDebounce";

import CustomTextBox from "@/app/components/vTextBox";
import CustomButton from "@/app/components/vButton";
import CustomMessage from "@/app/components/vMessage";
import CheckAuth from "@/app/components/CheckAuth";
import DeleteModal from "@/app/components/DeleteModal";

import CustomersTableDesktop from "./CustomersTableDesktop";
import CustomersListMobile from "./CustomersListMobile";


export default function CustomersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:768px)");

  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Customer modal
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone01, setPhone01] = useState("");
  const [phone02, setPhone02] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState("");

  // Delete Customer modal
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);


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

    // Filter customers
    useEffect(() => {
        if (debouncedSearchTerm) {
            const filtered = customers.filter(customer =>
                customer.firstname.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                customer.lastname.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                customer.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                customer.phone01.includes(debouncedSearchTerm) ||
                customer.phone02.includes(debouncedSearchTerm)
            );
            setFilteredCustomers(filtered);
        } else {
            setFilteredCustomers(customers);
        }
    }, [debouncedSearchTerm, customers]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const url = "/api/cust";
      const response = await fetch(url);
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
    router.push(`/ui/cust/${id}`);
  };

  const handleAddCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname,
          lastname,
          phone01,
          phone02,
          email,
          comments,
        }),
      });

      const result = await res.json();
      if (result.success) {
        showSuccess("New customer added: " + result.data.firstname + " " + result.data.lastname);
        setOpen(false);
        setFirstname("");
        setLastname("");
        setPhone01("");
        setPhone02("");
        setEmail("");
        setComments("");
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

  const handleDeleteCustomer = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/cust/${customerToDelete}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        showSuccess("Customer deleted successfully.");
        setOpenDeleteModal(false);
        setCustomerToDelete(null);
        await fetchCustomers();
      } else {
        showError("Error deleting customer: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      showError("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id) => {
    setCustomerToDelete(id);
    setOpenDeleteModal(true);
  };

  const cancelDelete = () => {
    setOpenDeleteModal(false);
    setCustomerToDelete(null);
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
            customers={filteredCustomers}
            loading={loading}
            onRowClick={handleRowClick}
          />
        ) : (
          <CustomersTableDesktop
            customers={filteredCustomers}
            loading={loading}
            onRowClick={handleRowClick}
            onAddCustomerClick={() => setOpen(true)}
            onDeleteCustomer={(ids) => confirmDelete(ids.length === 1 ? ids[0] : ids)}
            selected={selectedCustomers}
            onSelectionChange={setSelectedCustomers}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        )}
      </Box>

      {/* Add Customer Modal */}
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setFirstname("");
          setLastname("");
          setPhone01("");
          setPhone02("");
          setEmail("");
          setComments("");
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
              label="First Name"
              name="firstname"
              value={firstname}
              fullWidth
              required
              onChange={(e) => setFirstname(e.target.value)}
              autoFocus
            />
            <CustomTextBox
              label="Last Name"
              name="lastname"
              value={lastname}
              fullWidth
              required
              onChange={(e) => setLastname(e.target.value)}
            />
            <CustomTextBox
              label="Phone 01"
              name="phone01"
              value={phone01}
              fullWidth
              onChange={(e) => setPhone01(e.target.value)}
            />
            <CustomTextBox
              label="Phone 02"
              name="phone02"
              value={phone02}
              fullWidth
              onChange={(e) => setPhone02(e.target.value)}
            />
            <CustomTextBox
              label="Email"
              name="email"
              value={email}
              fullWidth
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomTextBox
              label="Comments"
              name="comments"
              value={comments}
              fullWidth
              multiline
              rows={3}
              onChange={(e) => setComments(e.target.value)}
            />

            <CustomButton
              type="submit"
              variant="contained"
              onClick={handleAddCustomer}
              disabled={loading || !firstname || !lastname || !email}
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

      <DeleteModal
        open={openDeleteModal}
        onClose={cancelDelete}
        onConfirm={handleDeleteCustomer}
        itemName="customer"
      />
    </Container>
  );
}
