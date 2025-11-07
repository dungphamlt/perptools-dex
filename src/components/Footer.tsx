import Logo from "../assets/icons/logo.svg";
import DiscordIcon from "../assets/icons/discord.svg";
import TwitterIcon from "../assets/icons/twitter.svg";
import Link from "next/link";
function Footer() {
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
  ];
  return (
    <footer className="bg-[#0E1215]">
      <div className="container px-4 py-12 mx-auto md:px-0">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4 justify-center items-center w-full md:w-3/5 md:items-start">
            <div className="flex gap-4 items-center">
              <Logo className="w-14 h-14" />
              <h2 className="text-2xl font-bold text-white">PERPTools</h2>
            </div>
            <p className="px-4 pt-6 text-center text-gray-300 md:text-left md:px-0">
              ApeX Protocol is shaping a free and open ecosystem for all users
              to grow their wealth in a safe and trusted environment.
            </p>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center md:flex-row">
            <div className="flex flex-col gap-4 justify-center py-8 md:py-0">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span className="font-medium text-white transition-colors hover:text-primary hover:underline">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4 justify-center w-full md:w-auto">
              <a
                href="https://x.com/perptools"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#009DFF1A] text-white/80 w-full md:w-auto hover:text-white transition-all duration-300 px-8 py-3 rounded-md flex items-center justify-center gap-2 hover:scale-105"
              >
                <TwitterIcon className="w-5 h-5" />
                <span className="font-medium">Twitter</span>
              </a>
              <button className="bg-[#009DFF1A] text-white/80 w-full md:w-auto hover:text-white transition-all duration-300 px-8 py-3 rounded-md flex items-center gap-2 justify-center hover:scale-105">
                <DiscordIcon className="w-5 h-5" />
                <span className="font-medium">Discord</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 border-t border-gray-800">
        <div className="container flex gap-1 justify-center items-center mx-auto text-sm text-gray-400 md:justify-between">
          <span className="block md:hidden"> © 2025 </span>
          <span>Perptools Protocol. All Rights Reserved.</span>
          <span className="hidden md:block"> © 2025 </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
