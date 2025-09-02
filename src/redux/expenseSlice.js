


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// API base URL
// const API_URL = "http://localhost:3000/api/expenses";

//this url is working with both vercel and localhost
const API_URL = "/api/expenses";


// 🔹 Thunks
export const fetchExpenses = createAsyncThunk(
    "expenses/fetchExpenses",
    async () => {
        const res = await axios.get(API_URL);
        return res.data;
    }
);

export const addExpense = createAsyncThunk(
    "expenses/addExpense",
    async (expense) => {
        const res = await axios.post(API_URL, expense);
        return res.data;
    }
);

export const deleteExpense = createAsyncThunk(
    "expenses/deleteExpense",
    async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        return id; // return deleted id
    }
);

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
        items: [],   // ✅ keep everything inside items
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload; // ✅ fixed here
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Add
            .addCase(addExpense.fulfilled, (state, action) => {
                state.items.push(action.payload);
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

export default expenseSlice.reducer;
