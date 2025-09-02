// src/app/dashboard/components/Fields.js
"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addExpense } from "../../../redux/expenseSlice";
import { useUser } from "../../context/UserContext.js"; // ✅ Import user context
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    useTheme,
} from "@mui/material";

export default function Fields() {
    const dispatch = useDispatch();
    const { currentUser } = useUser(); // ✅ Get current user
    const { loading } = useSelector((state) => state.expenses);

    const theme = useTheme();
    const getTodayDateString = () => new Date().toISOString().slice(0, 10);

    const [formData, setFormData] = useState({
        date: "",
        amount: "",
        description: "",
    });

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            date: getTodayDateString(),
        }));
    }, []);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();

        // ✅ Validate required fields
        if (!formData.amount || !formData.date) {
            alert("Please fill in both date and amount.");
            return;
        }

        // ✅ Dispatch with user information
        dispatch(addExpense({
            expense: formData,
            user: currentUser
        }));

        setFormData({
            date: getTodayDateString(),
            amount: "",
            description: ""
        });
    };

    return (
        <Paper
            elevation={6}
            sx={{
                width: "90vw",
                maxWidth: 600,
                mx: "auto",
                my: 4,
                px: { xs: 3, sm: 5 },
                py: { xs: 4, sm: 5 },
                borderRadius: 3,
                backgroundColor: theme.palette.mode === "light" ? "#fafafa" : "#202020",
                boxShadow:
                    theme.palette.mode === "light"
                        ? "0 4px 12px rgba(0,0,0,0.1)"
                        : "0 4px 20px rgba(0,0,0,0.6)",
                userSelect: "none",
            }}
        >
            <Typography
                variant="h5"
                component="h1"
                textAlign="center"
                mb={2}
                color={theme.palette.primary.main}
                fontWeight={700}
            >
                Add Expense
            </Typography>

            {/* ✅ Show current user */}
            <Typography
                variant="subtitle1"
                textAlign="center"
                mb={3}
                color={theme.palette.text.secondary}
                sx={{ textTransform: "capitalize" }}
            >
                Adding for: <strong>{currentUser}</strong>
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                display="flex"
                flexDirection="column"
                gap={3}
                sx={{ width: "100%" }}
            >
                <TextField
                    label="Date"
                    required
                    type="date"
                    name="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.date}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        "& .MuiInputBase-input": { padding: "14px 16px" },
                    }}
                />
                <TextField
                    label="Amount (₹)"
                    required
                    type="number"
                    inputMode="numeric"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    fullWidth
                    sx={{
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        "& .MuiInputBase-input": { padding: "14px 16px" },
                    }}
                />
                <TextField
                    label="Description"
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Optional"
                    fullWidth
                    multiline
                    minRows={2}
                    maxRows={4}
                    sx={{
                        fontSize: { xs: "1.1rem", sm: "1.2rem" },
                        "& .MuiInputBase-input": { padding: "14px 16px" },
                    }}
                />
                <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    disabled={loading} // ✅ Disable during loading
                    sx={{
                        py: 1.75,
                        fontSize: "1.15rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        textTransform: "none",
                        boxShadow: "0 4px 12px rgba(25,118,210,0.5)",
                        "&:hover": {
                            boxShadow: "0 6px 20px rgba(25,118,210,0.7)",
                        },
                    }}
                    disableElevation
                    aria-label="Submit expense form"
                >
                    {loading ? "Adding..." : "Submit"}
                </Button>
            </Box>
        </Paper>
    );
}