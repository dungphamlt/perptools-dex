import type { ReactNode } from "react";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative content-layer-bg">
        <div className="curved-streak-left" />
        <div className="relative z-10">
          <Header />
          <Banner />
        </div>
      </div>
      <main>{children}</main>
      <Footer />
    </div>
  );
}
