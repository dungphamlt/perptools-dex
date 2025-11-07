import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { WalletContextProvider } from "../components/WalletProvider";

export const metadata: Metadata = {
  title: "PERPTools",
  description: "AI meets DeFi — Perpetuals Reinvented",
  icons: {
    icon: "/logo.svg",
  },
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
