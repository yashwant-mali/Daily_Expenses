"use client";

import React, { useContext, useMemo } from "react";
import Link from "next/link";
import { ExpenseContext } from "../../dashboard/components/ExpenseContext";
import { Typography, Paper, Box, useTheme, Button } from "@mui/material";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ExpensesSummary() {
    const { expenses } = useContext(ExpenseContext);
    const theme = useTheme();

    const toDate = (dateStr) => new Date(dateStr + "T00:00:00");

    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    // Calculate total today as before
    const totalToday = useMemo(() => {
        return expenses
            .filter((exp) => exp.date === todayStr)
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    }, [expenses, todayStr]);

    // Calculate total for last 7 days including today
    const totalLast7Days = useMemo(() => {
        if (expenses.length === 0) return 0;

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(endOfToday.getDate() - 6); // 6 days before today
        sevenDaysAgo.setHours(0, 0, 0, 0);

        return expenses
            .filter(({ date }) => {
                const expenseDate = toDate(date);
                return expenseDate >= sevenDaysAgo && expenseDate <= endOfToday;
            })
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    }, [expenses]);

    const thisMonthStr = today.toISOString().slice(0, 7);
    const totalMonth = useMemo(() => {
        return expenses
            .filter((exp) => exp.date.startsWith(thisMonthStr))
            .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    }, [expenses, thisMonthStr]);

    const pieData = useMemo(() => {
        const group = {};
        expenses.forEach(({ date, amount }) => {
            group[date] = (group[date] || 0) + parseFloat(amount);
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
    }, [expenses]);

    return (
        <>
            {/* Fixed Back Button at top-right of screen (optional to uncomment) */}
            {/* <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1300, // above most content
        }}
      >
        <Button
          variant="outlined"
          component={Link}
          href="/dashboard"
          size="small"
          sx={{
            textTransform: "none",
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(25, 118, 210, 0.1)"
                  : "rgba(25, 118, 210, 0.2)",
              borderColor: theme.palette.primary.dark,
            },
          }}
        >
          Back
        </Button>
      </Box> */}

            {/* Main content with top padding to avoid overlap */}
            <Box sx={{ pt: 8, px: { xs: 1, sm: 2 } }}>
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
                                <Typography
                                    variant="h6"
                                    color="text.primary"
                                    fontWeight={700}
                                    sx={{ wordBreak: "break-word" }}
                                >
                                    ₹{totalToday.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box textAlign="center" sx={{ minWidth: 100, flex: "1 1 120px" }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total Last 7 Days
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.primary"
                                    fontWeight={700}
                                    sx={{ wordBreak: "break-word" }}
                                >
                                    ₹{totalLast7Days.toFixed(2)}
                                </Typography>
                            </Box>
                            <Box textAlign="center" sx={{ minWidth: 100, flex: "1 1 120px" }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total This Month
                                </Typography>
                                <Typography
                                    variant="h6"
                                    color="text.primary"
                                    fontWeight={700}
                                    sx={{ wordBreak: "break-word" }}
                                >
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
        </>
    );
}
