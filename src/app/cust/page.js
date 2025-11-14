"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Container, Typography, Chip, LinearProgress, Box,Stack,Modal } from "@mui/material";

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


export default function Customers() {

    const { data: session, status } = useSession();
    const router = useRouter();


    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    //New Customer
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    const {
        success,
        error,
        message,
        messageType,
        showMessage,
        showSuccess,
        showError,
        closeMessage
      } = useMessageHandler();



    // Redirect if the user is not authorized AFTER rendering
    useEffect(() => {
        if (status !== "loading" && (!session || session.user.level !== 100)) {
            router.push("/");
        }
    }, [session, status, router]);

    // Prevent fetching data until authentication is confirmed
    useEffect(() => {
        if (session?.user?.level === 100) {
            const retrieveCust = async () => {
                try {
                    const response = await fetch("http://localhost:3000/api/cust");
                    const result = await response.json();

                    if (result.success) {
                        setCustomers(result.data);
                    } else {
                        console.error("Error fetching customers:", result.error);
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                } finally {
                    setLoading(false);
                }
            };

            retrieveCust();
        }
    }, [session]);

    // Show a loading state while checking authentication
    if (status === "loading" || (!session && status !== "loading")) {
        return <CheckAuth />;
    }

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
            console.log(result.data.name);
            setOpen(false);
            setName("");
            showSuccess('New customer added with name: '+ result.data.name);
      
            // Refresh DataGrid
            const response = await fetch("/api/cust");
            const data = await response.json();
            setCustomers(data.data);
          } else {
            showError("Error: " + result.message)
          }
        } catch (err) {
          showError("Error: " + err.message)
        } finally {
          setLoading(false);
        }
      };
      
      

    const columns = [
        { field: "id", headerName: "ID", flex: 0.05, headerClassName: 'super', },
        { field: "name", headerName: "Name", flex: 0.25, headerClassName: 'super', },
        { field: "email", headerName: "Email", flex: 0.2, headerClassName: 'super', },
        { field: "phone", headerName: "Phone", flex: 0.2, headerClassName: 'super', },
        { field: "age", headerName: "Age", flex: 0.05, headerClassName: 'super', },
        { field: "startedYear", headerName: "Year", flex: 0.1, headerClassName: 'super', },
        {
            field: "active",
            headerName: "Active",
            flex: 0.1,
            renderCell: (params) => (
                <Chip
                    label={params.value === 1 ? "Active" : "Inactive"}
                    size="small"
                    sx={{
                        backgroundColor: params.value === 1 ? "#000" : "#ccc",
                        color: "#fff",
                        fontWeight: 600,
                        borderRadius: 1,
                    }}
                />
            ),
            sortable: false,
            align: "center",
            headerAlign: "center",
            headerClassName: 'super',
        }
    ];

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4">Customers</Typography>
                <CustomButton variant="contained" sx={{ backgroundColor: "#000" }} onClick={() => setOpen(true)}>+ Add</CustomButton>
            </Stack>
            <Box
                sx={{

                    width: '100%',
                    '& .super': {
                        backgroundColor: '#000',
                    },
                }}
            >
                <DataGrid
                    rows={customers}
                    columns={columns}
                    loading={loading}
                    disableSelectionOnClick
                    onRowClick={(params) => router.push(`/cust/${params.id}`)}
                    components={{ Toolbar: GridToolbar }}
                    loadingOverlaySlot={<LinearProgress />}
                    pageSizeOptions={[5, 10, 20]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10 } },
                    }}
                    sx={{
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        borderRadius: 2,
                        boxShadow: 3,
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: "#000 !important",
                            color: "#fff !important",
                            fontWeight: 600,
                        },
                        "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 600,
                        },
                        "& .MuiDataGrid-cell": {
                            color: "#333",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f0f0f0",
                            transition: "background-color 0.3s",
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            display: "none",
                        }
                    }}
                />

            </Box>
            <Modal open={open} onClose={() => {
                setOpen(false); 
                setFormData({
                    name: "",                   
                });}}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "#fff",
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" mb={2}>Add New Customer</Typography>
                    <Stack spacing={2}>
                        <CustomTextBox label="Name" name="name" fullWidth required  value={name} onChange={(e) => setName(e.target.value)} autoFocus/>
                        <CustomButton type="submit" variant="contained" onClick={handleAddCustomer} disabled={loading || !name}>
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
