// src/app/layout.js
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { UserProvider } from "./context/UserContext.js"; // ✅ Import UserProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider store={store}>
          <UserProvider> {/* ✅ Wrap with UserProvider */}
            {children}
          </UserProvider>
        </Provider>
      </body>
    </html>
  );
}