// src/model/expense.js
import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: false }, // ✅ Made optional to match frontend
    amount: { type: Number, required: true },
    user: { type: String, required: true, enum: ['nobita', 'doremon'] }, // ✅ Added user field
}, {
    collection: "ExpenseData",
    timestamps: true // ✅ Optional: adds createdAt and updatedAt
});

export default mongoose.models.ExpenseData || mongoose.model("ExpenseData", ExpenseSchema);