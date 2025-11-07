import {
  generateSigner,
  publicKey,
  signerIdentity,
  some,
  transactionBuilder,
  unwrapOption,
  type PublicKey as UmiPublicKey,
  type Signer,
  type Umi,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplCandyMachine,
  mintV1,
  fetchCandyMachine,
  safeFetchCandyGuard,
  safeFetchMintCounterFromSeeds,
  type CandyGuard,
  type CandyMachine,
  type DefaultGuardSetMintArgs,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { createSignerFromWalletAdapter } from "@metaplex-foundation/umi-signer-wallet-adapters";
import type { WalletAdapter } from "@solana/wallet-adapter-base";

export type TierKey = "onyx" | "gold" | "platinum";

export interface CandyMachineStats {
  itemsAvailable: number;
  itemsRedeemed: number;
  itemsRemaining: number;
  priceSol: number;
  startTimestamp: number | null;
  endTimestamp: number | null;
}

export interface CandyMachineBundle {
  candyMachine: CandyMachine;
  candyGuard: CandyGuard;
  address: string;
  stats: CandyMachineStats;
}

export interface CandyMachineErrorInfo {
  error: string;
  address: string;
}

export type CandyMachineInfo =
  | CandyMachineBundle
  | CandyMachineErrorInfo
  | null;

export type CandyMachineCollection = Record<TierKey, CandyMachineInfo>;

export interface MintEligibility {
  allowed: boolean;
  reason: string;
}

export interface MintResult {
  assets: string[];
  transaction: unknown;
}

export const RPC_ENDPOINT =
  "https://devnet.helius-rpc.com/?api-key=1e7399bd-0784-46d7-b4f4-4b5fb98532a9";

export const COLLECTION_MINT = "7g9W3eoDqEjnQvWnVJveF67NhQrCCx6tgHiSdtbkULha";

export const CANDY_MACHINES: Record<TierKey, string | null> = {
  onyx: "5FyBZHFX483y6ugvjeiwaznYL3Fhjs7yxbodVNwm2s89",
  gold: "BqcpVWoZ4W61iZW2sJLoPob1Hr8qcTgBTNUJT5f9zvm1",
  platinum: null,
};

export const createBaseUmi = (): Umi =>
  createUmi(RPC_ENDPOINT).use(mplCandyMachine());

export const createUmiWithWallet = (walletAdapter: WalletAdapter): Umi => {
  const signer: Signer = createSignerFromWalletAdapter(walletAdapter);
  return createUmi(RPC_ENDPOINT)
    .use(mplCandyMachine())
    .use(signerIdentity(signer));
};

export const parseNumericValue = (value: unknown): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }

  if (typeof value === "bigint") {
    try {
      return Number(value);
    } catch (error) {
      console.warn("Unable to convert bigint to number", error);
      return 0;
    }
  }

  if (
    value &&
    typeof (value as { valueOf: () => unknown }).valueOf === "function"
  ) {
    const numeric = Number((value as { valueOf: () => unknown }).valueOf());
    return Number.isNaN(numeric) ? 0 : numeric;
  }

  return 0;
};

export const extractTimestamp = (optionValue: unknown): number | null => {
  if (optionValue === null || optionValue === undefined) {
    return null;
  }

  if (typeof optionValue === "number") {
    return optionValue;
  }

  if (typeof optionValue === "bigint") {
    return Number(optionValue);
  }

  if (typeof optionValue === "object") {
    if (
      "date" in (optionValue as Record<string, unknown>) &&
      (optionValue as { date?: unknown }).date !== undefined
    ) {
      const dateValue = (optionValue as { date?: unknown }).date;
      return typeof dateValue === "bigint"
        ? Number(dateValue)
        : Number(dateValue);
    }

    if ("value" in (optionValue as Record<string, unknown>)) {
      return extractTimestamp((optionValue as { value?: unknown }).value);
    }

    if (
      typeof (optionValue as { valueOf: () => unknown }).valueOf === "function"
    ) {
      const numeric = Number(
        (optionValue as { valueOf: () => unknown }).valueOf()
      );
      return Number.isNaN(numeric) ? null : numeric;
    }
  }

  const numeric = Number(optionValue);
  return Number.isNaN(numeric) ? null : numeric;
};

const calculateStats = (bundleArgs: {
  candyMachine: CandyMachine;
  candyGuard: CandyGuard;
}): CandyMachineStats => {
  const { candyMachine, candyGuard } = bundleArgs;

  const itemsAvailable = parseNumericValue(candyMachine.data?.itemsAvailable);
  const itemsRedeemed = parseNumericValue(candyMachine.itemsRedeemed);
  const itemsRemaining = Math.max(itemsAvailable - itemsRedeemed, 0);

  const solPaymentGuard = unwrapOption(candyGuard.guards.solPayment);
  const priceSol = solPaymentGuard
    ? Number(solPaymentGuard.lamports.basisPoints) / 1_000_000_000
    : 0;

  const startDateGuard = unwrapOption(candyGuard.guards.startDate);
  const endDateGuard = unwrapOption(candyGuard.guards.endDate);

  const startTimestamp = extractTimestamp(startDateGuard);
  const endTimestamp = extractTimestamp(endDateGuard);

  return {
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
    priceSol,
    startTimestamp,
    endTimestamp,
  };
};

export const loadCandyMachines = async (
  umi: Umi
): Promise<CandyMachineCollection> => {
  const data: CandyMachineCollection = {
    onyx: null,
    gold: null,
    platinum: null,
  };

  for (const [tier, address] of Object.entries(CANDY_MACHINES) as [
    TierKey,
    string | null
  ][]) {
    if (!address) {
      data[tier] = null;
      continue;
    }

    try {
      const candyMachine = await fetchCandyMachine(umi, publicKey(address));
      const candyGuard = await safeFetchCandyGuard(
        umi,
        candyMachine.mintAuthority
      );

      if (!candyGuard) {
        throw new Error("Candy Guard account not found");
      }

      data[tier] = {
        candyMachine,
        candyGuard,
        address,
        stats: calculateStats({ candyMachine, candyGuard }),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      data[tier] = {
        error: message,
        address,
      };
    }
  }

  return data;
};

export const buildMintArgs = (
  candyGuard: CandyGuard
): Partial<DefaultGuardSetMintArgs> => {
  const mintArgs: Partial<DefaultGuardSetMintArgs> = {};

  const solPayment = unwrapOption(candyGuard.guards.solPayment);
  if (solPayment) {
    mintArgs.solPayment = some({
      destination: solPayment.destination,
    });
  }

  const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
  if (mintLimit) {
    mintArgs.mintLimit = some({
      id: mintLimit.id,
    });
  }

  return mintArgs;
};

const calculateLamportsForMint = (
  candyGuard: CandyGuard,
  quantity: number
): bigint => {
  const solPaymentGuard = unwrapOption(candyGuard.guards.solPayment);
  const lamportsPerMint = solPaymentGuard
    ? BigInt(solPaymentGuard.lamports.basisPoints)
    : BigInt(0);
  return lamportsPerMint * BigInt(quantity);
};

export const validateEligibility = async (
  umi: Umi,
  bundle: CandyMachineBundle,
  walletAddress: string | null,
  quantity: number,
  tierKey: TierKey
): Promise<MintEligibility> => {
  const desiredQuantity = Number.isFinite(quantity)
    ? Math.max(1, Math.floor(quantity))
    : 1;
  const { candyMachine, candyGuard } = bundle;

  if (bundle.stats.itemsRemaining <= 0) {
    return { allowed: false, reason: "No NFTs remaining" };
  }

  if (bundle.stats.itemsRemaining < desiredQuantity) {
    return {
      allowed: false,
      reason: `Only ${bundle.stats.itemsRemaining} NFTs remaining`,
    };
  }

  const startDate = unwrapOption(candyGuard.guards.startDate);
  const startTimestamp = extractTimestamp(startDate);
  if (startTimestamp !== null) {
    const slot = await umi.rpc.getSlot();
    const solanaTime = await umi.rpc.getBlockTime(slot);
    if (solanaTime !== null && solanaTime < startTimestamp) {
      return { allowed: false, reason: "Mint has not started" };
    }
  }

  const endDate = unwrapOption(candyGuard.guards.endDate);
  const endTimestamp = extractTimestamp(endDate);
  if (endTimestamp !== null) {
    const slot = await umi.rpc.getSlot();
    const solanaTime = await umi.rpc.getBlockTime(slot);
    if (solanaTime !== null && solanaTime > endTimestamp) {
      return { allowed: false, reason: "Mint period has ended" };
    }
  }

  const solPayment = unwrapOption(candyGuard.guards.solPayment);
  if (solPayment && walletAddress) {
    const account = await umi.rpc.getAccount(publicKey(walletAddress));
    if (!account.exists) {
      return {
        allowed: false,
        reason: "Wallet account does not exist on-chain",
      };
    }
    const lamportsField = account.lamports as
      | { basisPoints: bigint }
      | bigint
      | undefined;
    const solBalanceLamports =
      lamportsField && typeof lamportsField === "object"
        ? BigInt(lamportsField.basisPoints)
        : BigInt(lamportsField ?? 0);
    const pricePerMint = BigInt(solPayment.lamports.basisPoints);
    const requiredAmount = pricePerMint * BigInt(desiredQuantity);
    const feeBufferPerMint = BigInt(10_000_000); // ~0.01 SOL
    const feeBuffer = feeBufferPerMint * BigInt(desiredQuantity);

    if (solBalanceLamports < requiredAmount + feeBuffer) {
      return {
        allowed: false,
        reason: `Insufficient SOL balance for ${desiredQuantity} mint(s)`,
      };
    }
  }

  const mintLimit = unwrapOption(candyGuard.guards.mintLimit);
  if (mintLimit && walletAddress) {
    const rawLimit = parseNumericValue(mintLimit.limit);
    const hasValidLimit = Number.isFinite(rawLimit) && rawLimit > 0;
    let mintedCount = 0;

    if (hasValidLimit) {
      try {
        const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
          id: mintLimit.id,
          user: publicKey(walletAddress),
          candyMachine: candyMachine.publicKey,
          candyGuard: candyMachine.mintAuthority,
        });

        if (mintCounter) {
          const counterValue = parseNumericValue(mintCounter.count);
          mintedCount = Number.isFinite(counterValue) ? counterValue : 0;
        }
      } catch (error) {
        console.info(
          `[Mint Limit] Unable to fetch mint counter for ${tierKey}:`,
          error instanceof Error ? error.message : error
        );
      }

      if (mintedCount + desiredQuantity > rawLimit) {
        const remainingAllowance = Math.max(rawLimit - mintedCount, 0);
        return {
          allowed: false,
          reason: `You can mint ${remainingAllowance} more NFT(s) with this guard`,
        };
      }
    }
  }

  if (!Number.isFinite(desiredQuantity) || desiredQuantity <= 0) {
    return { allowed: false, reason: "Invalid mint quantity" };
  }

  return { allowed: true, reason: "" };
};

export const mintFromCandyMachine = async (
  umi: Umi,
  bundle: CandyMachineBundle,
  quantity: number,
  walletAddress: string,
  tierKey: TierKey
): Promise<MintResult> => {
  const parsedQuantity = Number.isFinite(quantity)
    ? Math.max(1, Math.floor(quantity))
    : 1;
  const { candyMachine, candyGuard } = bundle;

  const eligibility = await validateEligibility(
    umi,
    bundle,
    walletAddress,
    parsedQuantity,
    tierKey
  );
  if (!eligibility.allowed) {
    throw new Error(eligibility.reason);
  }

  const totalLamports = calculateLamportsForMint(candyGuard, parsedQuantity);

  const accountBefore = await umi.rpc.getAccount(publicKey(walletAddress));
  if (!accountBefore.exists) {
    throw new Error("Wallet account does not exist on-chain.");
  }
  const lamportsField = accountBefore.lamports as
    | { basisPoints: bigint }
    | bigint
    | undefined;
  const balanceBeforeLamports =
    lamportsField && typeof lamportsField === "object"
      ? BigInt(lamportsField.basisPoints)
      : BigInt(lamportsField ?? 0);

  console.log(
    `[Mint] tier=${tierKey} quantity=${parsedQuantity} totalLamports=${totalLamports.toString()} balanceBefore=${balanceBeforeLamports.toString()}`
  );

  let builder = transactionBuilder();
  const mintedAssets: Signer[] = [];

  for (let i = 0; i < parsedQuantity; i += 1) {
    const asset = generateSigner(umi);
    mintedAssets.push(asset);
    const mintArgs = buildMintArgs(candyGuard);

    builder = builder.add(
      mintV1(umi, {
        candyMachine: candyMachine.publicKey,
        collection: publicKey(COLLECTION_MINT),
        asset,
        candyGuard: candyGuard.publicKey,
        mintArgs,
      })
    );
  }

  const fits = await builder.fitsInOneTransaction(umi);
  if (!fits) {
    throw new Error(
      "Transaction size exceeded allowed limit. Please mint fewer NFTs per transaction."
    );
  }

  const transaction = await builder.sendAndConfirm(umi);

  const accountAfter = await umi.rpc.getAccount(publicKey(walletAddress));
  if (!accountAfter.exists) {
    throw new Error("Wallet account does not exist on-chain.");
  }
  const lamportsAfterField = accountAfter.lamports as
    | { basisPoints: bigint }
    | bigint
    | undefined;
  const balanceAfterLamports =
    lamportsAfterField && typeof lamportsAfterField === "object"
      ? BigInt(lamportsAfterField.basisPoints)
      : BigInt(lamportsAfterField ?? 0);

  console.log(
    `[Mint] balance diff=${(
      balanceBeforeLamports - balanceAfterLamports
    ).toString()} lamports`
  );

  const mintedKeys = mintedAssets.map((asset) => asset.publicKey.toString());

  return {
    assets: mintedKeys,
    transaction,
  };
};

export const formatTimestamp = (timestamp: number | null): string | null => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getWalletAddressString = (
  wallet: UmiPublicKey | null | undefined
): string | null => {
  if (!wallet) {
    return null;
  }
  return wallet.toString();
};
