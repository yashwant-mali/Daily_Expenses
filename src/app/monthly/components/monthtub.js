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

  // Grouping data unchanged...
  const groupedData = useMemo(() => {
    if (!items) return {};
    const map = {};
    items.forEach(({ date, amount, description, _id }) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = d.getMonth();

      if (!map[year]) map[year] = {};
      if (!map[year][month]) {
        map[year][month] = { total: 0, items: [] };
      }
      map[year][month].total += Number(amount);
      map[year][month].items.push({ date, amount, description, _id });
    });

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

  const filteredItems = useMemo(() => {
    if (!selectedYearMonth) return [];
    const [yearStr, monthStr] = selectedYearMonth.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    return groupedData[year]?.[month]?.items || [];
  }, [groupedData, selectedYearMonth]);

  const selectedMonthTotal = useMemo(() => {
    if (!selectedYearMonth) return 0;
    const [yearStr, monthStr] = selectedYearMonth.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    return groupedData[year]?.[month]?.total || 0;
  }, [groupedData, selectedYearMonth]);

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
    <Box sx={{ maxWidth: 700, mx: "auto", my: 4, px: { xs: 1, sm: 2, md: 3 } }}>
      {/* Year and month cards */}
      {Object.keys(groupedData)
        .sort((a, b) => b - a)
        .map((year) => (
          <Box key={year} sx={{ mb: 4 }}>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
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
                    sx={{ minWidth: 70, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
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
        <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, mt: 4, overflowX: "auto" }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontSize: { xs: '1rem', sm: '1.25rem' } }}
          >
            Expenses in{" "}
            {monthNames[parseInt(selectedYearMonth.split("-")[1], 10) - 1]}{" "}
            {selectedYearMonth.split("-")[0]} - Total: ₹{selectedMonthTotal.toFixed(2)}
          </Typography>
          {filteredItems.length === 0 ? (
            <Typography>No expenses for this month.</Typography>
          ) : (
            <Table sx={{ minWidth: 350 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Date</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Description</TableCell>
                  <TableCell sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} align="right">Amount (₹)</TableCell>
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
                      <TableCell
                        colSpan={1}
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          verticalAlign: "middle",
                          px: { xs: 1, sm: 2 },
                          minWidth: 100,
                          fontSize: { xs: '0.75rem', sm: '0.9rem' },
                        }}
                      >
                        {date}
                      </TableCell>

                      <TableCell sx={{ width: "100%" }} />

                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          textAlign: "right",
                          verticalAlign: "middle",
                          px: { xs: 1, sm: 2 },
                          minWidth: 120,
                          fontSize: { xs: '0.75rem', sm: '0.9rem' },
                        }}
                      >
                        Total Amount : ₹{items.reduce((sum, item) => sum + Number(item.amount), 0).toFixed(2)}
                      </TableCell>
                    </TableRow>

                    {items.map(({ _id, description, amount }) => (
                      <TableRow key={_id}>
                        <TableCell sx={{ px: { xs: 1, sm: 2 } }} />
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}>{description || "-"}</TableCell>
                        <TableCell sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }} align="right">
                          {amount}
                        </TableCell>
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
