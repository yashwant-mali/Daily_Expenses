"use client";

import React, { useContext, useMemo, useState } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import {
    Paper,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    useTheme,
    Button,
    TextField,
    IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ExpensesGroupedByDate() {
    // Hooks called at the top level, unconditionally
    const { expenses, setExpenses } = useContext(ExpenseContext);
    const theme = useTheme();
    const [changeDate, setChangeDate] = useState(null);
    const [editData, setEditData] = useState({});

    // Group expenses by date and calculate daily totals
    console.log(expenses);
    const expensesByDate = useMemo(() => {
        if (!expenses) return {};
        return expenses.reduce((groups, exp) => {
            if (!groups[exp.date]) groups[exp.date] = { items: [], total: 0 };
            groups[exp.date].items.push(exp);
            groups[exp.date].total += parseFloat(exp.amount);
            return groups;
        }, {});
    }, [expenses]);

    // Sort dates descending (latest first)
    const sortedDates = Object.keys(expensesByDate).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    // Early return after all hooks
    if (!expenses || expenses.length === 0) {
        return (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
                No expenses recorded yet.
            </Typography>
        );
    }

    // Toggle change mode for a date group
    const toggleChange = (date) => {
        setChangeDate(changeDate === date ? null : date);
        setEditData({});
    };

    // Track input changes in update form
    const handleEditInputChange = (id, field, value) => {
        setEditData((prev) => ({
            ...prev,
            [id]: { ...prev[id], [field]: value },
        }));
    };

    // Update an expense by id
    const handleUpdate = (id) => {
        const updated = editData[id];
        const originalExp = expenses.find((exp) => exp.id === id);
        const newAmount = updated?.amount ?? originalExp?.amount;

        if (!newAmount || newAmount === "") {
            alert("Amount is required to update.");
            return;
        }

        setExpenses((prevExpenses) =>
            prevExpenses.map((exp) =>
                exp.id === id
                    ? {
                        ...exp,
                        amount: newAmount,
                        description:
                            updated?.description !== undefined
                                ? updated.description
                                : exp.description,
                    }
                    : exp
            )
        );

        setEditData((prev) => {
            const copy = { ...prev };
            delete copy[id];
            return copy;
        });
    };


    // Delete an expense by id
    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            setExpenses((prevExpenses) => prevExpenses.filter((exp) => exp.id !== id));
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", my: 4, px: { xs: 2, sm: 3 } }}>
            {sortedDates.map((date) => (
                <Paper
                    key={date}
                    elevation={4}
                    sx={{
                        p: { xs: 2.5, sm: 3.5 },
                        mb: 3,
                        borderRadius: 3,
                        bgcolor: theme.palette.mode === "light" ? "#f9f9f9" : "#292929",
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <Typography
                            variant="h6"
                            fontWeight="700"
                            sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                            color={theme.palette.primary.main}
                        >
                            {date}
                            <Typography color="red">Total: ₹{expensesByDate[date].total.toFixed(2)}</Typography>
                        </Typography>
                        <Button variant="outlined" size="small" onClick={() => toggleChange(date)}>
                            {changeDate === date ? "Close" : "Change"}
                        </Button>
                    </Box>

                    <List dense disablePadding>
                        {expensesByDate[date].items.map(({ id, amount, description }, i) => {
                            const isEditing = changeDate === date;
                            const edited = editData[id] || {};
                            return (
                                <ListItem
                                    key={id}
                                    sx={{
                                        py: 1,
                                        borderBottom:
                                            i < expensesByDate[date].items.length - 1 ? "1px solid" : "none",
                                        borderColor: theme.palette.divider,
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    {isEditing ? (
                                        <>
                                            <TextField
                                                size="small"
                                                type="number"
                                                label="Amount"
                                                value={edited.amount ?? amount}
                                                onChange={(e) =>
                                                    handleEditInputChange(id, "amount", e.target.value)
                                                }
                                                sx={{ width: "100px" }}
                                            />
                                            <TextField
                                                size="small"
                                                label="Description"
                                                value={edited.description ?? description}
                                                onChange={(e) =>
                                                    handleEditInputChange(id, "description", e.target.value)
                                                }
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleUpdate(id)}
                                                sx={{ whiteSpace: "nowrap" }}
                                            >
                                                Update
                                            </Button>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDelete(id)}
                                            >
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <ListItemText
                                            primary={`₹${amount}`}
                                            primaryTypographyProps={{
                                                fontSize: { xs: "1.1rem", sm: "1.2rem" },
                                                fontWeight: 600,
                                            }}
                                            secondary={description || "-"}
                                            secondaryTypographyProps={{
                                                fontSize: { xs: "0.9rem", sm: "1rem" },
                                                color: theme.palette.text.secondary,
                                            }}
                                            sx={{ flexGrow: 1 }}
                                        />
                                    )}
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            ))}
        </Box>
    );
}
