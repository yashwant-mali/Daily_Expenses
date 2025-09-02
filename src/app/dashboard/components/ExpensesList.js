// src/app/dashboard/components/ExpensesList.js
"use client";

import React, { useEffect, useMemo, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses, updateExpense, deleteExpense } from "../../../redux/expenseSlice";
import { useUser } from "../../context/UserContext.js"; // ✅ Import user context

export default function ExpensesGroupedByDate() {
    const dispatch = useDispatch();
    const theme = useTheme();
    const { currentUser } = useUser(); // ✅ Get current user
    const { items, loading, error } = useSelector((state) => state.expenses);

    const [changeDate, setChangeDate] = useState(null);
    const [editData, setEditData] = useState({});

    // ✅ Fetch expenses when component mounts or user changes
    useEffect(() => {
        dispatch(fetchExpenses(currentUser));
    }, [dispatch, currentUser]);

    // Group expenses by date and calculate daily totals
    const expensesByDate = useMemo(() => {
        if (!items) return {};
        return items.reduce((groups, exp) => {
            const dateKey = exp.date.split("T")[0]; // normalize date string
            if (!groups[dateKey]) groups[dateKey] = { items: [], total: 0 };
            groups[dateKey].items.push(exp);
            groups[dateKey].total += parseFloat(exp.amount);
            return groups;
        }, {});
    }, [items]);

    // Sort dates descending
    const sortedDates = Object.keys(expensesByDate).sort(
        (a, b) => new Date(b) - new Date(a)
    );

    // Toggle edit mode for a date group
    const toggleChange = (date) => {
        setChangeDate(changeDate === date ? null : date);
        setEditData({});
    };

    // Track input changes in update form
    const handleEditInputChange = (_id, field, value) => {
        setEditData((prev) => ({
            ...prev,
            [_id]: { ...prev[_id], [field]: value },
        }));
    };

    // Update an expense
    const handleUpdate = (_id) => {
        const updated = editData[_id];
        const original = items.find((exp) => exp._id === _id);
        if (!updated?.amount && !original?.amount) {
            alert("Amount is required to update.");
            return;
        }

        dispatch(
            updateExpense({
                id: _id,
                updatedData: {
                    amount: updated?.amount ?? original.amount,
                    description: updated?.description ?? original.description,
                },
            })
        );

        // Clear edit data for this item
        setEditData((prev) => {
            const copy = { ...prev };
            delete copy[_id];
            return copy;
        });
    };

    // Delete an expense
    const handleDelete = (_id) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            dispatch(deleteExpense(_id));
        }
    };

    if (loading) return <Typography align="center">Loading {currentUser}'s expenses...</Typography>;
    if (error) return <Typography color="error" align="center">{error}</Typography>;
    if (!items || items.length === 0)
        return (
            <Typography align="center" sx={{ mt: 4 }}>
                No expenses recorded for <strong style={{ textTransform: "capitalize" }}>{currentUser}</strong> yet.
            </Typography>
        );

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", my: 4, px: { xs: 2, sm: 3 } }}>
            {/* ✅ Show user-specific header */}
            <Typography
                variant="h6"
                textAlign="center"
                mb={3}
                sx={{ textTransform: "capitalize", fontWeight: 600 }}
            >
                {currentUser}&apos;s Expenses
            </Typography>

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
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Box>
                            <Typography variant="h6" fontWeight="700" color={theme.palette.primary.main}>
                                {date}
                            </Typography>
                            <Typography color="red">Total: ₹{expensesByDate[date].total.toFixed(2)}</Typography>
                        </Box>
                        <Button variant="outlined" size="small" onClick={() => toggleChange(date)}>
                            {changeDate === date ? "Close" : "Change"}
                        </Button>
                    </Box>

                    <List dense disablePadding>
                        {expensesByDate[date].items.map(({ _id, amount, description }, i) => {
                            const isEditing = changeDate === date;
                            const edited = editData[_id] || {};
                            return (
                                <ListItem
                                    key={_id}
                                    sx={{
                                        py: 1,
                                        borderBottom: i < expensesByDate[date].items.length - 1 ? "1px solid" : "none",
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
                                                onChange={(e) => handleEditInputChange(_id, "amount", e.target.value)}
                                                sx={{ width: "100px" }}
                                            />
                                            <TextField
                                                size="small"
                                                label="Description"
                                                value={edited.description ?? description}
                                                onChange={(e) =>
                                                    handleEditInputChange(_id, "description", e.target.value)
                                                }
                                                sx={{ flexGrow: 1 }}
                                            />
                                            <Button variant="contained" size="small" onClick={() => handleUpdate(_id)}>
                                                Update
                                            </Button>
                                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(_id)}>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <ListItemText
                                            primary={`₹${amount}`}
                                            primaryTypographyProps={{ fontSize: { xs: "1.1rem", sm: "1.2rem" }, fontWeight: 600 }}
                                            secondary={description || "-"}
                                            secondaryTypographyProps={{ fontSize: { xs: "0.9rem", sm: "1rem" }, color: theme.palette.text.secondary }}
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