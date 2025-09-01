



import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./expenseSlice";

const store = configureStore({
    reducer: {
        expenses: expenseReducer, // ✅ must be "expenses"
    },
});

export default store;
