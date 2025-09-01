"use client";

import React from "react";
import Link from "next/link";
// import { ExpenseProvider } from "./components/ExpenseContext";
import Fields from "./components/Fields";
import ExpensesList from "./components/ExpensesList";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Summary from "../summary/page";

export default function DashboardPage() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        // <ExpenseProvider>
        <div>
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton
                    aria-label="menu"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="large"
                    sx={{
                        color: "rgba(255, 255, 255, 0.87)", // visible in dark mode
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    sx={{
                        "& .MuiPaper-root": {
                            backgroundColor: "#fafafaff", // dark background matching dark theme
                            color: "rgba(9, 9, 9, 0.87)", // white text for contrast
                            boxShadow: "0px 2px 12px rgba(247, 243, 243, 0.7)",
                        },
                    }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
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
                </Menu>
            </Box>
            <Fields />
            <ExpensesList />
            <Summary />
        </div>
        // </ExpenseProvider>
    );
}
