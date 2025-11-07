"use client";
import { useState } from "react";
import Logo from "../assets/icons/logo.svg";
import { ChevronRight, ExternalLink, Menu, X } from "lucide-react";
import TwitterIcon from "../assets/icons/twitter.svg";
import DiscordIcon from "../assets/icons/discord.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    {
      label: "NFT Sale",
      href: "/nft-sale",
    },
    {
      label: "AI Agent",
      href: "/ai-agent",
    },
    {
      label: "Roadmap",
      href: "/roadmap",
    },
    {
      label: "Social",
      href: "/social",
    },
  ];

  return (
    <header className="relative border-b border-primary/40">
      <div className="container px-4 py-4 mx-auto md:py-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex gap-2 items-center">
            <Logo className="w-10 h-10 md:w-12 md:h-12" />
            <h1 className="text-xl font-bold text-white md:text-2xl">
              PerpTools
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden gap-6 items-center px-6 py-2 rounded-lg md:flex bg-primary/10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  className={` hover:text-primary transition-colors font-medium ${
                    pathname === item.href ? "text-primary" : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>

          {/* Desktop Launch App Button */}
          <div className="hidden gap-2 items-center md:flex">
            {pathname === "/nft-sale" ? (
              <WalletMultiButton className="bg-linear-to-b! from-[#2BB9F3]! to-[#83D4FB]! text-black! hover:from-primary! hover:to-primary! transition-all! duration-300! rounded-lg! font-medium!" />
            ) : (
              <Link
                href="/nft-sale"
                className="flex items-center gap-1 px-4 py-2 rounded-md bg-gradient-to-b from-[#2BB9F3] to-[#83D4FB] text-black font-semibold hover:bg-gradient-to-b hover:from-primary hover:to-primary transition-all duration-300 cursor-pointer hover:scale-105"
              >
                <span>Launch App</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white transition-colors hover:text-primary"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7 text-gray-300 transition-colors hover:text-white" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="pb-4 mt-4 md:hidden">
            <div className="flex flex-col gap-4 pt-4">
              {navItems.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="block py-2 font-medium text-gray-300 transition-colors hover:text-primary">
                    {item.label}
                  </span>
                </Link>
              ))}
              <div className="py-4 border-t border-gray-600">
                <a
                  className="flex justify-between items-center py-2 mb-4 text-gray-300 hover:text-primary"
                  href="https://x.com/PerpTools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex gap-2 items-center transition-all duration-300 hover:scale-105">
                    <TwitterIcon className="w-5 h-5" />
                    <span className="font-medium">Twitter</span>
                  </button>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  className="flex justify-between items-center py-2 text-gray-300 hover:text-primary"
                  href="https://discord.gg/PerpTools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="flex gap-2 items-center transition-all duration-300 hover:scale-105">
                    <DiscordIcon className="w-5 h-5" />
                    <span className="font-medium">Discord</span>
                  </button>
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
