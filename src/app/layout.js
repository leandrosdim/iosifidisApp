"use client";

import "./globals.css";
import dynamic from "next/dynamic";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import SilkBackground from "./components/layout/SilkBackground";

const inter = Inter({
  subsets: ["latin", "greek"],
  variable: "--font-sans", // will fill the CSS variable we used above
});

//  Dynamically import Sidebar + Silk without SSR
const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en" className={inter.variable}>
        <body>        
            <Sidebar />
            <main style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)" }}>
              {children}
            </main>
        </body>
      </html>
    </SessionProvider>
  );
}
