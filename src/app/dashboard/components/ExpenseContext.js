"use client";

import React, { createContext, useState } from "react";

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
    const [expenses, setExpenses] = useState([]);

    const addExpense = (expense) => {
        const id = Date.now() + Math.random().toString(36).substring(2, 9);
        setExpenses((prev) => [...prev, { ...expense, id }]);
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, setExpenses }}>
            {children}
        </ExpenseContext.Provider>
    );
}
