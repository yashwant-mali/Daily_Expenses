// src/redux/expenseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "/api/expenses";

// 🔹 Fetch expenses for specific user
export const fetchExpenses = createAsyncThunk(
    "expenses/fetchExpenses",
    async (user) => {
        const res = await axios.get(`${API_URL}?user=${user}`);
        return res.data;
    }
);

// 🔹 Add expense with user
export const addExpense = createAsyncThunk(
    "expenses/addExpense",
    async ({ expense, user }) => {
        const expenseWithUser = { ...expense, user };
        const res = await axios.post(API_URL, expenseWithUser);
        return res.data;
    }
);

// 🔹 Delete expense (no user needed since we delete by ID)
export const deleteExpense = createAsyncThunk(
    "expenses/deleteExpense",
    async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id;
    }
);

// 🔹 Update expense (no user needed since we update by ID)
export const updateExpense = createAsyncThunk(
    "expenses/updateExpense",
    async ({ id, updatedData }) => {
        const res = await axios.put(`${API_URL}/${id}`, updatedData);
        return res.data;
    }
);

// 🔹 Slice
const expenseSlice = createSlice({
    name: "expenses",
    initialState: {
        items: [],
        loading: false,
        error: null,
        currentUser: 'nobita', // ✅ Track current user in Redux too
    },
    reducers: {
        // ✅ Action to set current user
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload;
            state.items = []; // Clear items when switching users
        },
        // ✅ Clear expenses (useful when switching users)
        clearExpenses: (state) => {
            state.items = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add
            .addCase(addExpense.pending, (state) => {
                state.loading = true;
            })
            .addCase(addExpense.fulfilled, (state, action) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(addExpense.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Delete
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter((exp) => exp._id !== action.payload);
            })
            // Update
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex((exp) => exp._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    },
});

export const { setCurrentUser, clearExpenses } = expenseSlice.actions;
export default expenseSlice.reducer;