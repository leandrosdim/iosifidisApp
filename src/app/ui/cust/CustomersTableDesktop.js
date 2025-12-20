import useDebounce from "@/lib/useDebounce";
import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Checkbox,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomTextBox from "@/app/components/vTextBox";
import { visuallyHidden } from "@mui/utils";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Columns for your customers data
const headCells = [
  {
    id: "firstname",
    numeric: false,
    disablePadding: false,
    label: "First Name",
  },
  {
    id: "lastname",
    numeric: false,
    disablePadding: false,
    label: "Last Name",
  },
  { id: "phone01", numeric: false, disablePadding: false, label: "Phone 01" },
  { id: "phone02", numeric: false, disablePadding: false, label: "Phone 02" },
  { id: "email", numeric: false, disablePadding: false, label: "Email" },
  {
    id: "active",
    numeric: false,
    disablePadding: false,
    label: "Active",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    label: "Actions",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow
        sx={{
          backgroundColor: "var(--color-shell)",
          "& th": {
            color: "var(--color-shell-text)",
            fontWeight: 600,
            fontSize: 13,
            borderBottom: "1px solid var(--color-border-strong)",
          },
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            sx={{ color: "var(--color-shell-text)" }}
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all customers",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={
              headCell.numeric
                ? "right"
                : headCell.id === "active"
                ? "center"
                : "left"
            }
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              width:
                headCell.id === "firstname" || headCell.id === "lastname"
                  ? "15%"
                  : headCell.id === "phone01" || headCell.id === "phone02"
                  ? "12.5%"
                  : headCell.id === "email"
                  ? "25%"
                  : headCell.id === "active" || headCell.id === "actions"
                  ? "10%"
                  : undefined,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              sx={{
                // default label color
                color: "var(--color-shell-text) !important",
                // color when active (sorted)
                "&.Mui-active": {
                  color: "var(--color-shell-text) !important",
                },
                // color on hover (optional but keeps it consistent)
                "&:hover": {
                  color: "var(--color-shell-text) !important",
                },
                // sort arrow color
                "& .MuiTableSortLabel-icon": {
                  color: "var(--color-shell-text) !important",
                },
              }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar({ numSelected, onAddCustomerClick, onDeleteCustomer, selected, onSearchChange }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  React.useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        borderBottom: "1px solid var(--color-border-subtle)",
        backgroundColor:
          numSelected > 0 ? "var(--color-primary-soft)" : "transparent",
        color: numSelected > 0 ? "var(--color-primary-strong)" : "inherit",
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%", color: "var(--color-text-main)" }}
          variant="subtitle1"
          id="tableTitle"
          component="div"
        >
          Customers
        </Typography>
      )}

      <CustomTextBox
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          minWidth: 200,
          marginRight: 2,
        }}
      />

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <span>
            <IconButton size="small" onClick={() => onDeleteCustomer(selected)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      ) : (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Add Customer">
            <IconButton size="small" onClick={onAddCustomerClick}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filter list">
            <IconButton size="small">
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Toolbar>
  );
}

export default function CustomersTableDesktop({
  customers,
  loading,
  onRowClick, // called on double click
  onSelectionChange, // optional: gets array of selected IDs
  onAddCustomerClick,
  onDeleteCustomer, // new: function to call when delete is requested
  selected, // new: currently selected customer IDs
  onSearchChange, // new: handler for search term changes
}) {
  const rows = customers || [];

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");

  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      onSelectionChange(newSelected);
      return;
    }
    onSelectionChange([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    onSelectionChange(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (id) => selected.includes(id);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      rows
        .slice()
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper
        sx={{
          width: "100%",
          mb: 1,
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
      >
        <EnhancedTableToolbar
          numSelected={selected.length}
          onAddCustomerClick={onAddCustomerClick}
          onDeleteCustomer={onDeleteCustomer}
          selected={selected}
          onSearchChange={onSearchChange}
        />

        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    onDoubleClick={() =>
                      onRowClick ? onRowClick(row.id) : null
                    }
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "var(--color-primary-soft)",
                      },
                      "& td": {
                        borderBottom: "1px solid var(--color-border-subtle)",
                        fontSize: 13,
                        color: "var(--color-text-main)",
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      sx={{ width: "15%" }}
                    >
                      {row.firstname}
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                      sx={{ width: "15%" }}
                    >
                      {row.lastname}
                    </TableCell>
<TableCell padding="normal" sx={{ width: "12.5%" }}>{row.phone01}</TableCell>
                    <TableCell padding="normal" sx={{ width: "12.5%" }}>{row.phone02}</TableCell>
                    <TableCell padding="normal" sx={{ width: "25%" }}>{row.email}</TableCell>
                    <TableCell align="center" padding="normal" sx={{ width: "10%" }}>
                      {row.active === 1 || row.active === true ? "Yes" : "No"}
                    </TableCell>
                    <TableCell align="center" padding="normal" sx={{ width: "10%" }}>
                      <Tooltip title="View Customer">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            onRowClick(row.id);
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={7} />
                </TableRow>
              )}
              {!loading && rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                    sx={{
                      color: "var(--color-text-muted)",
                      py: 4,
                    }}
                  >
                    No customers yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid var(--color-border-subtle)",
            ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
              {
                fontSize: 12,
                color: "var(--color-text-muted)",
              },
          }}
        />
      </Paper>

      <FormControlLabel
        control={
          <Switch checked={dense} onChange={handleChangeDense} size="small" />
        }
        label="Dense padding"
        sx={{
          ml: 1,
          ".MuiFormControlLabel-label": {
            fontSize: 12,
            color: "var(--color-text-muted)",
          },
        }}
      />
    </Box>
  );
}
