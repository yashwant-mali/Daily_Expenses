// src/app/dashboard/page.js
"use client";

import React from "react";
import Link from "next/link";
import Fields from "./components/Fields";
import ExpensesList from "./components/ExpensesList";
import { Box, IconButton, Menu, MenuItem, Typography, Chip } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import Summary from "../summary/page";
import { useUser } from "../context/UserContext.js"; // ✅ Import user context
import { useDispatch } from "react-redux";
import { setCurrentUser, clearExpenses } from "../../redux/expenseSlice";

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { currentUser, switchUser } = useUser(); // ✅ Get user context
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // ✅ Handle user switching
    const handleUserSwitch = (user) => {
        switchUser(user); // Update context
        dispatch(setCurrentUser(user)); // Update Redux
        dispatch(clearExpenses()); // Clear current expenses
        handleClose();
    };

    return (
        <div>
            {/* ✅ Header with current user display */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderBottom: "1px solid rgba(255,255,255,0.1)"
            }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonIcon sx={{ color: "rgba(255, 255, 255, 0.87)" }} />
                    <Chip
                        label={currentUser.charAt(0).toUpperCase() + currentUser.slice(1)}
                        color="primary"
                        variant="outlined"
                        sx={{
                            fontWeight: 600,
                            textTransform: "capitalize"
                        }}
                    />
                </Box>

                <IconButton
                    aria-label="menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="large"
                    sx={{
                        color: "rgba(255, 255, 255, 0.87)",
                    }}
                >
                    <MenuIcon />
                </IconButton>
            </Box>

            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#fafafaff",
                        color: "rgba(9, 9, 9, 0.87)",
                        boxShadow: "0px 2px 12px rgba(247, 243, 243, 0.7)",
                    },
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                {/* ✅ User Selection Menu Items */}
                <MenuItem
                    onClick={() => handleUserSwitch('nobita')}
                    sx={{
                        fontWeight: currentUser === 'nobita' ? 700 : 400,
                        backgroundColor: currentUser === 'nobita' ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    Nobita Expenses
                </MenuItem>
                <MenuItem
                    onClick={() => handleUserSwitch('doremon')}
                    sx={{
                        fontWeight: currentUser === 'doremon' ? 700 : 400,
                        backgroundColor: currentUser === 'doremon' ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    Doremon Expenses
                </MenuItem>

                {/* ✅ Summary Link */}
                <MenuItem
                    onClick={handleClose}
                    component={Link}
                    href="/summary"
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    Summary
                </MenuItem>
                {/* monthly */}
                <MenuItem
                    onClick={handleClose}
                    component={Link}
                    href="/monthly"
                    sx={{
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                        },
                    }}
                >
                    Monthly
                </MenuItem>
            </Menu>

            <Fields />
            <ExpensesList />
            <Summary />
        </div>
    );
}