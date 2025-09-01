import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
}, { collection: "Expense" });

export default mongoose.models.Expense || mongoose.model("Expense", ExpenseSchema);
