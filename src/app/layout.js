"use client";

import "./globals.css";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";

// ✅ Dynamically import Sidebar without SSR
const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body>
          <Sidebar />
          <main style={{ minHeight: "100vh", backgroundColor: "#f4f4f4" }}>{children}</main>
        </body>
      </html>
    </SessionProvider>
  );
}
