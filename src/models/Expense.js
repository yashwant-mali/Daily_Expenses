import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
}, { collection: "ExpenseData" });

export default mongoose.models.ExpenseData || mongoose.model("ExpenseData", ExpenseSchema);
