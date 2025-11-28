import { Box, Stack, Typography, Chip, LinearProgress } from "@mui/material";

export default function CustomersListMobile({
  customers,
  loading,
  onRowClick,
}) {
  return (
    <Box sx={{ p: 1.5 }}>
      {loading && (
        <LinearProgress
          sx={{
            mb: 1.5,
            backgroundColor: "var(--color-primary-soft)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "var(--color-primary)",
            },
          }}
        />
      )}

      {customers.length === 0 && !loading && (
        <Box
          sx={{
            textAlign: "center",
            py: 3,
            color: "var(--color-text-muted)",
            fontSize: 14,
          }}
        >
          No customers yet.
        </Box>
      )}

      <Stack spacing={1.2}>
        {customers.map((c) => (
          <Box
            key={c.id}
            onClick={() => onRowClick(c.id)}
            sx={{
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-card)",
              boxShadow: "var(--shadow-soft)",
              border: "1px solid var(--color-border-subtle)",
              padding: 1.2,
              display: "flex",
              flexDirection: "column",
              gap: 0.3,
              cursor: "pointer",
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                sx={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--color-text-main)",
                }}
              >
                {c.name}
              </Typography>

              <Chip
                label={c.active === 1 ? "Active" : "Inactive"}
                size="small"
                sx={{
                  backgroundColor:
                    c.active === 1
                      ? "var(--color-success)"
                      : "var(--color-danger)",
                  color: "var(--color-surface)",
                  fontWeight: 600,
                  borderRadius: "var(--radius-pill)",
                  fontSize: 11,
                }}
              />
            </Stack>

            <Typography
              sx={{
                fontSize: 12,
                color: "var(--color-text-muted)",
              }}
            >
              {c.phone} {c.email ? `· ${c.email}` : ""}
            </Typography>

            {c.startedYear && (
              <Typography
                sx={{
                  fontSize: 11,
                  color: "var(--color-text-muted)",
                }}
              >
                Since {c.startedYear}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
