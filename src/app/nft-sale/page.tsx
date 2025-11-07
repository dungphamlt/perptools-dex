"use client";

import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Platinum from "../../assets/images/Platinum.svg?url";
import Gold from "../../assets/images/Gold.svg?url";
import Onyx from "../../assets/images/Onyx.svg?url";
import Twitter from "../../assets/icons/twitter.svg";
import Discord from "../../assets/icons/discord.svg";
import DexOrderly from "../../assets/icons/dex-orderly.svg";

function NftSale() {
  const [selectedNft, setSelectedNft] = useState<string>("Platinum");
  const [amountSol, setAmountSol] = useState<number>(1);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState<boolean>(true);
  const MINT_FEE = 0.009;
  const nftSaleData = [
    {
      name: "Onyx",
      image: Onyx,
    },
    {
      name: "Gold",
      image: Gold,
    },
    {
      name: "Platinum",
      image: Platinum,
    },
  ];

  const socialData = [
    {
      name: "twitter",
      link: "https://twitter.com/perptools",
      icon: Twitter,
    },
    {
      name: "discord",
      link: "https://discord.com/perptools",
      icon: Discord,
    },
    {
      name: "dex.orderly",
      link: "https://dex.orderly.io/perptools",
      icon: DexOrderly,
    },
  ];

  const RenderNftMintCard = () => {
    return (
      <div className="px-4 py-6 md:p-6 rounded-2xl border border-primary/40">
        <div className="flex justify-between items-center mb-8">
          <span className="text-white text-lg  md:text-2xl font-semibold md:font-medium">{`NFT Sale ${selectedNft}`}</span>
          <a
            href="#"
            className="border border-primary text-sm md:text-base font-semibold md:font-medium flex items-center gap-1 px-3 py-1 hover:bg-primary transition-all duration-300 text-primary hover:text-black rounded-lg"
          >
            <span>Contract</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
        <div className="flex items-center gap-4 mb-8">
          {socialData.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <social.icon className="w-5 h-5" />
              <span>{social.name}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 font-medium">Mint Fee</span>
          <span className="text-white font-medium">{MINT_FEE} SOL</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-400 font-medium">Total Minted</span>
          <span className="text-white font-medium">9.4% 353/3737</span>
        </div>
        <div className="relative h-2.5 border border-primary/40 rounded-full">
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full"
            style={{ width: "9.4%" }}
          ></div>
        </div>
        <div className="border border-primary/40 rounded-lg p-4 my-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white text-lg font-medium">Public</span>
            <button className="bg-[rgba(63,208,139,0.15)] text-[#3FD08B] border border-[#3FD08B] px-4 py-2 rounded-lg flex items-center gap-1">
              <span className="w-2 h-2 bg-[#3FD08B] rounded-full"></span>
              <span className="text-sm font-medium">Live</span>
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="">
              <span className="text-white text-lg font-medium pr-2">1 SOL</span>
              <span className="text-gray-400 font-medium">(160$)</span>
            </div>
            <div className="flex gap-6 text-white text-lg font-medium px-4 py-1 border border-primary/40 rounded-lg">
              <button className="" onClick={() => setAmountSol(amountSol - 1)}>
                -
              </button>
              <span className="text-white font-medium w-8 text-center">
                {amountSol}
              </span>
              <button className="" onClick={() => setAmountSol(amountSol + 1)}>
                +
              </button>
            </div>
          </div>
        </div>
        <button className="w-full py-3 text-center text-lg font-semibold md:font-medium rounded-lg bg-gradient-to-b from-[#2BB9F3] to-[#83D4FB] text-black hover:bg-gradient-to-b hover:from-primary hover:to-primary transition-all duration-300 cursor-pointer">
          Connect Wallet
        </button>
        <p className="text-white text-md text-center mt-6">
          Limit 10 Per Wallet.
        </p>
      </div>
    );
  };
  return (
    <div>
      <div className="container mx-auto pt-6 pb-10 px-4 md:px-0">
        <div className="flex">
          <Link
            href="/"
            className="flex items-center gap-1 font-medium text-white hover:text-primary transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
        </div>
        <div className="flex justify-between flex-col md:flex-row gap-10 px-0 md:px-16 mt-8">
          <div className="w-full md:w-5/12 ">
            <div className="mb-8">
              <Image
                src={Platinum}
                alt="Platinum"
                width={480}
                height={480}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {nftSaleData.map((nft) => (
                <div
                  key={nft.name}
                  className={`cursor-pointer rounded-xl md:rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 hover:border-2 hover:border-primary ${
                    selectedNft === nft.name ? "border-2 border-primary" : ""
                  }`}
                  onClick={() => setSelectedNft(nft.name)}
                >
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={280}
                    height={280}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-7/12">
            <RenderNftMintCard />
            {/* Overview */}
            <div className="border border-primary/40 rounded-lg p-4 md:p-6 my-6 bg-black">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white text-2xl font-medium">
                  Overview
                </span>
                <button
                  onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                  className="text-primary hover:text-primary/80 transition-colors cursor-pointer"
                >
                  <ChevronUp
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOverviewExpanded ? "" : "rotate-180"
                    }`}
                  />
                </button>
              </div>
              {isOverviewExpanded && (
                <div className="space-y-4">
                  <p className="text-gray-300 text-base leading-relaxed">
                    Kyzzen.io is your all-in-one explorer for opportunities on
                    Solana, aggregating data from Solana's major protocols to
                    highlight the best opportunities spanning tokens, NFTs,
                    DeFi, DePIN, airdrops and more.
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed">
                    The Kyzzen no Sekai NFT unlocks our most advanced products:
                    premium alpha signals, unique analytics, and rich portfolio
                    intelligence to guide smarter, faster decisions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NftSale;
