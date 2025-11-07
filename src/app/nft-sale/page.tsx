"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronUp } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import type { Umi } from "@metaplex-foundation/umi";
import {
  type CandyMachineBundle,
  type CandyMachineCollection,
  type CandyMachineInfo,
  type TierKey,
  createBaseUmi,
  createUmiWithWallet,
  formatTimestamp,
  loadCandyMachines,
  mintFromCandyMachine,
} from "@/lib/candyMachine";
import Twitter from "../../assets/icons/twitter.svg";
import Discord from "../../assets/icons/discord.svg";
import DexOrderly from "../../assets/icons/dex-orderly.svg";
import Onyx from "../../assets/images/Onyx.svg?url";
import Gold from "../../assets/images/Gold.svg?url";
import Platinum from "../../assets/images/Platinum.svg?url";

function NftSale() {
  const [selectedNft, setSelectedNft] = useState<string>("Platinum");
  const [amountSol, setAmountSol] = useState<number>(1);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState<boolean>(true);
  const MINT_FEE = 0.009;
  const nftSaleData = [
    {
      name: "Onyx",
      image: Onyx,
      overView:
        "A symbol of true mastery in the PerpTools ecosystem. Only a handful exist. Onyx holders gain top-tier access to AI trading intelligence, early protocol features, private strategy sessions, and the highest yield multipliers. The ultimate level of exclusivity and influence.",
    },
    {
      name: "Gold",
      image: Gold,
      overView:
        "Your gateway to the PerpTools community. Enjoy early access to new tools, reward boosts, and entry into exclusive community events. Built for dedicated traders ready to grow with the ecosystem.",
    },
    {
      name: "Platinum",
      image: Platinum,
      overView:
        "For those at the frontier of trading innovation. Platinum holders unlock early access to experimental AI agents, higher reward rates, and priority participation in upcoming drops and events. A perfect balance of power, privilege, and performance.",
    },
  ];

const socialData = [
  { name: "twitter", link: "https://twitter.com/perptools", Icon: Twitter },
  { name: "discord", link: "https://discord.com/perptools", Icon: Discord },
  {
    name: "dex.orderly",
    link: "https://dex.orderly.io/perptools",
    Icon: DexOrderly,
  },
];

const MINT_FEE = 0.01;

type StatusType = "info" | "error" | "success";

const TOAST_MESSAGES: Record<StatusType, string> = {
  success: "Congratulations on your successful purchase!",
  error: "Something went wrong. Please try again or check your connection.!",
  info: "Please add your wallet to make a purchase.",
};

const TOAST_INDICATOR_CLASSES: Record<StatusType, string> = {
  success: "bg-green-400",
  error: "bg-red-400",
  info: "bg-sky-400",
};

const TOAST_TEXT_CLASSES: Record<StatusType, string> = {
  success: "text-green-100",
  error: "text-red-200",
  info: "text-sky-100",
};

export default function NftSalePage() {
  const { connected, wallet, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [selectedNft, setSelectedNft] = useState<(typeof nftSaleData)[number]>(
    nftSaleData[2]
  );
  const [mintQuantity, setMintQuantity] = useState<number>(1);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(true);
  const [candyData, setCandyData] = useState<CandyMachineCollection>({
    onyx: null,
    gold: null,
    platinum: null,
  });
  const [umi, setUmi] = useState<Umi | null>(null);
  const baseUmiRef = useRef<Umi>(createBaseUmi());
  const [isLoading, setIsLoading] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: StatusType;
    message: string;
  } | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBundle = useCallback(
    (info: CandyMachineInfo): info is CandyMachineBundle =>
      info !== null && "candyMachine" in info,
    []
  );

  const showToast = useCallback((type: StatusType, message?: string) => {
    setStatusMessage({
      type,
      message: message ?? TOAST_MESSAGES[type],
    });
  }, []);

  const refreshCandyData = useCallback(
    async (umiInstance: Umi) => {
      setIsLoading(true);
      try {
        const result = await loadCandyMachines(umiInstance);
        setCandyData(result);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        showToast("error", `${TOAST_MESSAGES.error}\n${message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    setUmi(baseUmiRef.current);
    void refreshCandyData(baseUmiRef.current);
  }, [refreshCandyData]);

  useEffect(() => {
    if (connected && wallet?.adapter) {
      try {
        const umiWithWallet = createUmiWithWallet(wallet.adapter);
        setUmi(umiWithWallet);
        void refreshCandyData(umiWithWallet);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        showToast("error", `${TOAST_MESSAGES.error}\n${message}`);
      }
    } else {
      setUmi(baseUmiRef.current);
      void refreshCandyData(baseUmiRef.current);
    }
  }, [connected, wallet?.adapter, refreshCandyData, showToast]);

  useEffect(() => {
    if (!statusMessage) {
      return undefined;
    }

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setStatusMessage(null);
      toastTimerRef.current = null;
    }, 4000);

    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
    };
  }, [statusMessage]);

  const selectedTierKey = selectedNft.key;
  const selectedEntry = candyData[selectedTierKey];

  const selectedStats = useMemo(() => {
    if (isBundle(selectedEntry)) {
      return selectedEntry.stats;
    }
    return {
      itemsAvailable: 0,
      itemsRedeemed: 0,
      itemsRemaining: 0,
      priceSol: 0,
      startTimestamp: null,
      endTimestamp: null,
    };
  }, [isBundle, selectedEntry]);

  useEffect(() => {
    const maxMintable = Math.max(selectedStats.itemsRemaining, 1);
    setMintQuantity((prev) => {
      const normalized = Number.isFinite(prev)
        ? Math.max(1, Math.floor(prev))
        : 1;
      return Math.min(normalized, maxMintable);
    });
  }, [selectedStats.itemsRemaining]);

  const startTimeLabel = useMemo(
    () => formatTimestamp(selectedStats.startTimestamp),
    [selectedStats.startTimestamp]
  );
  const endTimeLabel = useMemo(
    () => formatTimestamp(selectedStats.endTimestamp),
    [selectedStats.endTimestamp]
  );

  const handleMint = useCallback(async () => {
    if (!umi) {
      showToast("error", `${TOAST_MESSAGES.error}\nMinting is not ready yet.`);
      return;
    }

    if (!publicKey) {
      showToast("info");
      setVisible(true);
      return;
    }

    if (!isBundle(selectedEntry)) {
      const errorMessage =
        selectedEntry && "error" in selectedEntry
          ? selectedEntry.error
          : "Candy Machine data is not ready";
      showToast("error", `${TOAST_MESSAGES.error}\n${errorMessage}`);
      return;
    }

    const quantity = Number.isFinite(mintQuantity)
      ? Math.max(1, Math.floor(mintQuantity))
      : 1;
    const walletAddress = publicKey.toBase58();

    setIsMinting(true);

    try {
      const result = await mintFromCandyMachine(
        umi,
        selectedEntry,
        quantity,
        walletAddress,
        selectedTierKey
      );
      showToast(
        "success",
        `${TOAST_MESSAGES.success}\n${result.assets.join("\n")}`
      );
      setMintQuantity(1);
      await refreshCandyData(umi);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showToast("error", `${TOAST_MESSAGES.error}\n${message}`);
    } finally {
      setIsMinting(false);
    }
  }, [
    isBundle,
    mintQuantity,
    publicKey,
    refreshCandyData,
    selectedEntry,
    selectedTierKey,
    umi,
    setVisible,
    showToast,
  ]);

  const maxMintable = useMemo(
    () => Math.max(selectedStats.itemsRemaining, 1),
    [selectedStats.itemsRemaining]
  );

  return (
    <div className="dark-gradient-bg">
      {statusMessage && (
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="fixed right-6 top-20 z-50 px-5 py-4 max-w-sm text-sm rounded-xl border shadow-lg backdrop-blur border-white/20 bg-black/80"
        >
          <div className="flex gap-3 items-start">
            <span
              className={`mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
                TOAST_INDICATOR_CLASSES[statusMessage.type]
              }`}
            />
            <p
              className={`whitespace-pre-line leading-relaxed ${
                TOAST_TEXT_CLASSES[statusMessage.type]
              }`}
            >
              {statusMessage.message}
            </p>
          </div>
        </div>
      )}
      <div className="container pt-6 pb-10 mx-auto">
        <div className="flex">
          <Link
            href="/"
            className="flex gap-1 items-center font-medium text-white transition-colors hover:text-primary"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back Home</span>
          </Link>
        </div>
        <div className="flex flex-col gap-10 justify-between px-4 mt-8 lg:flex-row lg:px-16">
          <div className="lg:w-5/12">
            <div className="overflow-hidden mb-8 rounded-3xl border border-primary/40">
              <Image
                src={selectedNft.image}
                alt={selectedNft.name}
                width={480}
                height={480}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {nftSaleData.map((nft) => (
                <button
                  key={nft.name}
                  type="button"
                  onClick={() => setSelectedNft(nft)}
                  className={`cursor-pointer rounded-3xl overflow-hidden transition-all duration-300 border-2 ${
                    selectedNft.name === nft.name
                      ? "border-primary"
                      : "border-transparent hover:border-primary"
                  }`}
                >
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-7/12">
            <div className="p-6 rounded-2xl border border-primary/40">
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-medium text-white">{`NFT Sale ${selectedNft.name}`}</span>
                <a
                  href="https://solscan.io/token/9A24BFGjkNw8VocAS3tccUu3JmdHhrLgJ3yNg7kxodbR?cluster=devnet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-1 items-center px-3 py-1 font-medium rounded-lg border transition-all duration-300 border-primary hover:bg-primary text-primary hover:text-black"
                >
                  <span>Contract</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

              <div className="flex gap-4 items-center mb-8">
                {socialData.map(({ name, link, Icon }) => (
                  <a
                    key={name}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-1 items-center transition-colors text-white/80 hover:text-white"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{name}</span>
                  </a>
                ))}
              </div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-400">Mint Fee</span>
                <span className="font-medium text-white">
                  {MINT_FEE.toFixed(4)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-400">Total Minted</span>
                <span className="font-medium text-white">
                  {selectedStats.itemsAvailable > 0
                    ? `${(
                        (selectedStats.itemsRedeemed /
                          Math.max(selectedStats.itemsAvailable, 1)) *
                        100
                      ).toFixed(1)}% ${selectedStats.itemsRedeemed}/${
                        selectedStats.itemsAvailable
                      }`
                    : "N/A"}
                </span>
              </div>
              <div className="relative h-2.5 border border-primary/40 rounded-full">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-primary"
                  style={{
                    width:
                      selectedStats.itemsAvailable > 0
                        ? `${Math.min(
                            100,
                            (selectedStats.itemsRedeemed /
                              Math.max(selectedStats.itemsAvailable, 1)) *
                              100
                          ).toFixed(1)}%`
                        : "0%",
                  }}
                />
              </div>
              <div className="grid grid-cols-1 gap-2 mt-4 text-sm text-white/70">
                {startTimeLabel && (
                  <div className="flex justify-between items-center">
                    <span>Start Time</span>
                    <span>{startTimeLabel}</span>
                  </div>
                )}
                {endTimeLabel && (
                  <div className="flex justify-between items-center">
                    <span>End Time</span>
                    <span>{endTimeLabel}</span>
                  </div>
                )}
              </div>

              <div className="p-4 my-6 rounded-lg border border-primary/40">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium text-white">Public</span>
                  <button className="bg-[rgba(63,208,139,0.15)] text-[#3FD08B] border border-[#3FD08B] px-4 py-2 rounded-lg flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#3FD08B] rounded-full" />
                    <span className="text-sm font-medium">Live</span>
                  </button>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="pr-2 text-lg font-medium text-white">
                      {selectedStats.priceSol.toFixed(4)} SOL
                    </span>
                    <span className="font-medium text-gray-400">(160$)</span>
                  </div>
                  <div className="flex gap-6 px-4 py-1 text-lg font-medium text-white rounded-lg border border-primary/40">
                    <button
                      type="button"
                      disabled={isMinting || mintQuantity <= 1}
                      onClick={() =>
                        setMintQuantity((prev) => Math.max(1, prev - 1))
                      }
                    >
                      -
                    </button>
                    <span className="w-8 font-medium text-center text-white">
                      {mintQuantity}
                    </span>
                    <button
                      type="button"
                      disabled={isMinting || mintQuantity >= maxMintable}
                      onClick={() =>
                        setMintQuantity((prev) =>
                          Math.min(maxMintable, prev + 1)
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleMint}
                className="w-full py-3 text-center text-lg font-medium rounded-lg bg-linear-to-b from-[#2BB9F3] to-[#83D4FB] text-black hover:from-primary hover:to-primary transition-all duration-300 cursor-pointer mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={
                  isMinting ||
                  isLoading ||
                  (connected && !isBundle(selectedEntry))
                }
              >
                {connected
                  ? isMinting
                    ? "Minting..."
                    : "Mint"
                  : "Connect Wallet"}
              </button>
              <p className="mt-6 text-center text-white text-md">
                Limit 10 Per Wallet.
              </p>
            </div>

            <div className="p-6 my-6 rounded-lg border border-primary/40 bg-black/60">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-medium text-white">
                  Overview
                </span>
                <button
                  type="button"
                  onClick={() => setIsOverviewExpanded((prev) => !prev)}
                  className="transition-colors text-primary hover:text-primary/80"
                >
                  <ChevronUp
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOverviewExpanded ? "":"rotate-180"}`}
                  />
                </button>
              </div>
              {isOverviewExpanded && (
                <div className="space-y-4">
                  <p className="text-base leading-relaxed text-gray-300">
                    {
                      nftSaleData.find((nft) => nft.name === selectedNft)
                        ?.overView
                    }
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
