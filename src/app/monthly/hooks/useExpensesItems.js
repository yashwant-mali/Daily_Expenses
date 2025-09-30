import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../../redux/expenseSlice"; // Adjust path as needed
import { useUser } from "../../context/UserContext"; // Import the custom hook

export function useExpensesItems() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.expenses);
    const { currentUser } = useUser(); // Use the custom hook to get user

    useEffect(() => {
        if (currentUser) {
            dispatch(fetchExpenses(currentUser));
        }
    }, [dispatch, currentUser]);

    return { items, loading, error };
}
