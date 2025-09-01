"use Client"

import React from "react";
// import { ExpenseProvider } from "../dashboard/components/ExpenseContext";
import ExpensesSummary from "./components/ExpensesSummary";

export default function SummaryPage() {
    return (
        // <ExpenseProvider>
        <ExpensesSummary />
        // </ExpenseProvider>
    );
}
