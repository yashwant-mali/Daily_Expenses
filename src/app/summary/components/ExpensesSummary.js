"use client";

import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses } from "../../../redux/expenseSlice";
import { Typography, Paper, Box, useTheme } from "@mui/material";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ItemsSummary() {
    const dispatch = useDispatch();
    const theme = useTheme();

    // ✅ Access Redux slice correctly
    const { items, loading, error } = useSelector((state) => state.expenses);

    // ✅ Fetch expenses on mount
    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    // Utility function to parse date
    const toDate = (dateStr) => new Date(dateStr + "T00:00:00");

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // ✅ Total for today
    const totalToday = useMemo(() => {
        if (!items) return 0;
        return items
            .filter((exp) => exp.date.slice(0, 10) === todayStr)
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    }, [items, todayStr]);

    // ✅ Total last 7 days
    const totalLast7Days = useMemo(() => {
        if (!items) return 0;

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(endOfToday.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        return items
            .filter(({ date }) => {
                const expenseDate = toDate(date);
                return expenseDate >= sevenDaysAgo && expenseDate <= endOfToday;
            })
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    }, [items]);

    // ✅ Total this month
    const thisMonthStr = today.toISOString().slice(0, 7);
    const totalMonth = useMemo(() => {
        if (!items) return 0;
        return items
            .filter((exp) => exp.date.startsWith(thisMonthStr))
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    }, [items, thisMonthStr]);

    // ✅ Pie chart data grouped by date
    const pieData = useMemo(() => {
        if (!items) return { labels: [], datasets: [] };

        const group = {};
        items.forEach(({ date, amount }) => {
            const day = date.slice(0, 10); // normalize date
            group[day] = (group[day] || 0) + parseFloat(amount);
        });

        const labels = Object.keys(group).sort();
        const data = labels.map((label) => group[label]);

        return {
            labels,
            datasets: [
                {
                    label: "Expenses by Date",
                    data,
                    backgroundColor: [
                        "#1976d2",
                        "#dc004e",
                        "#ffa726",
                        "#66bb6a",
                        "#ab47bc",
                        "#29b6f6",
                        "#ff7043",
                    ],
                    borderWidth: 1,
                },
            ],
        };
    }, [items]);

    if (loading) return <Typography align="center">Loading...</Typography>;
    if (error) return <Typography align="center" color="error">{error}</Typography>;
    if (!items || items.length === 0)
        return <Typography align="center">No expenses recorded yet.</Typography>;

    return (
        <Box sx={{ pt: 4, px: { xs: 1, sm: 2 } }}>
            <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Paper
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 3,
                        bgcolor: theme.palette.mode === "light" ? "#fafafa" : "#202020",
                        boxShadow:
                            theme.palette.mode === "light"
                                ? "0 4px 14px rgba(0,0,0,0.12)"
                                : "0 4px 20px rgba(0,0,0,0.9)",
                        userSelect: "none",
                    }}
                >
                    <Typography
                        variant="h5"
                        gutterBottom
                        align="center"
                        color={theme.palette.primary.main}
                        fontWeight={700}
                        mb={{ xs: 3, sm: 4 }}
                    >
                        Expense Summary
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-around",
                            flexWrap: "wrap",
                            gap: { xs: 2, sm: 3 },
                            mb: { xs: 3, sm: 4 },
                        }}
                    >
                        <Box textAlign="center" sx={{ minWidth: 100, flex: "1 1 120px" }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Total Today
                            </Typography>
                            <Typography variant="h6" color="text.primary" fontWeight={700}>
                                ₹{totalToday.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box textAlign="center" sx={{ minWidth: 100, flex: "1 1 120px" }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Total Last 7 Days
                            </Typography>
                            <Typography variant="h6" color="text.primary" fontWeight={700}>
                                ₹{totalLast7Days.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box textAlign="center" sx={{ minWidth: 100, flex: "1 1 120px" }}>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Total This Month
                            </Typography>
                            <Typography variant="h6" color="text.primary" fontWeight={700}>
                                ₹{totalMonth.toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
                        <Pie data={pieData} />
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}
