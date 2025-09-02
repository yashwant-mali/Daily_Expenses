// src/app/api/expenses/route.js
import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

// GET expenses with optional user filter
export async function GET(req) {
    try {
        await connectDB();

        // ✅ Get user from query parameters
        const { searchParams } = new URL(req.url);
        const user = searchParams.get('user');

        // ✅ Filter by user if provided
        const filter = user ? { user } : {};
        const expenses = await Expense.find(filter).sort({ date: -1 }); // Sort by newest first

        return new Response(JSON.stringify(expenses), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// POST a new expense
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        // ✅ Validate required fields including user
        if (!body.user || !['nobita', 'doremon'].includes(body.user)) {
            return new Response(
                JSON.stringify({ error: "Valid user (nobita or doremon) is required" }),
                { status: 400 }
            );
        }

        if (!body.amount || !body.date) {
            return new Response(
                JSON.stringify({ error: "Amount and date are required" }),
                { status: 400 }
            );
        }

        const expense = await Expense.create(body);
        return new Response(JSON.stringify(expense), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}