import React, { useState, useMemo } from "react";
import { useExpensesItems } from "../hooks/useExpensesItems"; // Adjust path as needed
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function MonthTub() {
  const { items, loading, error } = useExpensesItems();
  const [selectedYearMonth, setSelectedYearMonth] = useState(null);

  // Group by year and month with total calculation
  const groupedData = useMemo(() => {
    if (!items) return {};
    const map = {};
    items.forEach(({ date, amount, description, _id }) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth(); // zero-based month

      if (!map[year]) map[year] = {};
      if (!map[year][month]) {
        map[year][month] = { total: 0, items: [] };
      }
      map[year][month].total += Number(amount);
      map[year][month].items.push({ date, amount, description, _id });
    });

    // Sort months within each year
    Object.keys(map).forEach((year) => {
      const months = map[year];
      map[year] = Object.keys(months)
        .sort((a, b) => a - b)
        .reduce((acc, month) => {
          acc[month] = months[month];
          return acc;
        }, {});
    });

    return map;
  }, [items]);

  // Filter items and total for selected year and month
  const filteredItems = useMemo(() => {
    if (!selectedYearMonth) return [];
    const [yearStr, monthStr] = selectedYearMonth.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // zero-based
    return groupedData[year]?.[month]?.items || [];
  }, [groupedData, selectedYearMonth]);

  const selectedMonthTotal = useMemo(() => {
    if (!selectedYearMonth) return 0;
    const [yearStr, monthStr] = selectedYearMonth.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    return groupedData[year]?.[month]?.total || 0;
  }, [groupedData, selectedYearMonth]);

  // Group filtered items by date string for table grouping
  const groupedByDate = useMemo(() => {
    return filteredItems.reduce((groups, item) => {
      const dateKey = new Date(item.date).toLocaleDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
      return groups;
    }, {});
  }, [filteredItems]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!items || items.length === 0)
    return <Typography>No expenses found.</Typography>;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", my: 4 }}>
      {/* Year and month cards */}
      {Object.keys(groupedData)
        .sort((a, b) => b - a)
        .map((year) => (
          <Box key={year} sx={{ mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              {year}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {Object.keys(groupedData[year]).map((month) => {
                const ymKey = `${year}-${(parseInt(month, 10) + 1)
                  .toString()
                  .padStart(2, "0")}`;
                return (
                  <Button
                    key={ymKey}
                    variant={selectedYearMonth === ymKey ? "contained" : "outlined"}
                    onClick={() => setSelectedYearMonth(ymKey)}
                    sx={{ minWidth: 80 }}
                  >
                    {monthNames[parseInt(month, 10)]}
                  </Button>
                );
              })}
            </Box>
          </Box>
        ))}

      {/* Table for selected month data with grouped dates */}
      {selectedYearMonth && (
        <Paper sx={{ p: 2, mt: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Expenses in{" "}
            {monthNames[parseInt(selectedYearMonth.split("-")[1], 10) - 1]}{" "}
            {selectedYearMonth.split("-")[0]} - Total: ₹{selectedMonthTotal.toFixed(2)}
          </Typography>
          {filteredItems.length === 0 ? (
            <Typography>No expenses for this month.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedByDate).map(([date, items], index) => (
                  <React.Fragment key={date}>
                    <TableRow
                      sx={{
                        bgcolor: index % 2 === 0 ? "action.hover" : "background.default",
                      }}
                    >
                      <TableCell colSpan={3} sx={{ fontWeight: "bold" }}>
                        {date}
                      </TableCell>
                    </TableRow>
                    {items.map(({ _id, description, amount }) => (
                      <TableRow key={_id}>
                        <TableCell />
                        <TableCell>{description || "-"}</TableCell>
                        <TableCell align="right">{amount}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      )}
    </Box>
  );
}
