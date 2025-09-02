import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";

// GET all expenses
export async function GET() {
    try {
        console.log('API called - checking environment');
        console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
        console.log('URI starts with mongodb:', process.env.MONGODB_URI?.startsWith('mongodb'));

        console.log('Attempting to connect to database...');
        await connectDB();
        console.log('Database connected successfully');

        console.log('Fetching expenses...');
        const expenses = await Expense.find({});
        console.log('Expenses found:', expenses.length);

        return new Response(JSON.stringify(expenses), { status: 200 });
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({
            error: error.message,
            stack: error.stack
        }), { status: 500 });
    }
}

// POST a new expense
export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        const expense = await Expense.create(body);
        return new Response(JSON.stringify(expense), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}


// DELETE an expense by ID
export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const { id } = params;

        const deletedExpense = await Expense.findByIdAndDelete(id);

        if (!deletedExpense) {
            return new Response(JSON.stringify({ error: "Expense not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Expense deleted successfully", id }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

// UPDATE an expense by ID
export async function PUT(req, { params }) {
    try {
        await connectDB();
        const { id } = params;
        const body = await req.json();

        const updatedExpense = await Expense.findByIdAndUpdate(id, body, { new: true });

        if (!updatedExpense) {
            return new Response(JSON.stringify({ error: "Expense not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(updatedExpense), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

