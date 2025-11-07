import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { WalletContextProvider } from "../components/WalletProvider";

export const metadata: Metadata = {
  title: "PerpTools",
  description: "AI meets DeFi — Perpetuals Reinvented",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black antialiased">
        <WalletContextProvider>{children}</WalletContextProvider>
      </body>
    </html>
  );
}
