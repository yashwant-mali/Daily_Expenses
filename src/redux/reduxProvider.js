"use client";

import { Provider } from "react-redux";
import { store } from "./store";   // ✅ named import, not default

export default function ReduxProvider({ children }) {
    return <Provider store={store}>{children}</Provider>;
}
