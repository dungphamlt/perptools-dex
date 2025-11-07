"use client";
import { useState } from "react";
import Logo from "../assets/icons/logo.svg";
import { ChevronRight, ExternalLink, Menu, X } from "lucide-react";
import TwitterIcon from "../assets/icons/twitter.svg";
import DiscordIcon from "../assets/icons/discord.svg";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10 md:w-12 md:h-12" />
            <h1 className="text-xl md:text-2xl font-bold text-white">
              PerpTools
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 px-6 py-2 rounded-lg bg-primary/10">
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
          <div className="hidden md:flex items-center gap-2">
            <button className="flex items-center gap-1 px-4 py-2 rounded-md bg-gradient-to-b from-[#2BB9F3] to-[#83D4FB] text-black font-semibold hover:bg-gradient-to-b hover:from-primary hover:to-primary transition-all duration-300 cursor-pointer hover:scale-105">
              <span>
                {pathname === "/nft-sale" ? "Connect Wallet" : "Launch App"}
              </span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-7 h-7 text-gray-300 hover:text-white transition-colors" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col gap-4 pt-4">
              {navItems.slice(0, 3).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="text-gray-300 hover:text-primary transition-colors font-medium block py-2">
                    {item.label}
                  </span>
                </Link>
              ))}
              <div className="border-t border-gray-600 py-4">
                <a
                  className="flex items-center justify-between text-gray-300 hover:text-primary mb-4 py-2"
                  href="https://x.com/PerpTools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className=" transition-all duration-300 flex items-center gap-2 hover:scale-105">
                    <TwitterIcon className="w-5 h-5" />
                    <span className="font-medium">Twitter</span>
                  </button>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <a
                  className="flex items-center justify-between text-gray-300 hover:text-primary py-2"
                  href="https://discord.gg/PerpTools"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className=" transition-all duration-300 flex items-center gap-2 hover:scale-105">
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
