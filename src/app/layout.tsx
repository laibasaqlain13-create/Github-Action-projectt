import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import LayoutController from "@/layouts/LayoutController";
//@ts-ignore: side-effect global CSS import (no type declarations)
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HunarConnect",
  description: "HunarConnect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <LayoutController>
            {children}
          </LayoutController>
        </AuthProvider>
      </body>
    </html>
  );
}