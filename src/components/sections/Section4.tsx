"use client";

import { motion } from "framer-motion";
import CexIcon from "../../assets/icons/cex.svg";
import EcosystemIcon from "../../assets/icons/ecosystem.svg";
import IntelligenceIcon from "../../assets/icons/intelligence.svg";
import LiquidityIcon from "../../assets/icons/liquidity.svg";
function Section4() {
  const products = [
    {
      title: "CEX-grade speed, DeFi principles",
      icon: <CexIcon className="w-14 h-14" />,
      description:
        "Sub-200ms latency and instant execution — trade like a centralized exchange while staying fully on-chain, self-custodial, and transparent.",
    },
    {
      title: "Collaborative ecosystem",
      icon: <EcosystemIcon className="w-14 h-14" />,
      description:
        "Permissionless. Transparent. Community-owned. The next evolution of decentralized trading.",
    },
    {
      title: "AI-powered intelligence",
      icon: <IntelligenceIcon className="w-14 h-14" />,
      description:
        "Autonomous trading agents trained and validated by elite quant teams across the globe — bringing institutional precision to DeFi markets.",
    },
    {
      title: "Unified <br/> liquidity",
      icon: <LiquidityIcon className="w-14 h-14" />,
      description:
        "Omnichain orderbook connecting liquidity across blockchains. No bridges. No friction. Just seamless execution.",
    },
  ];

  const headerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const headerItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const productsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const productItemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };
  return (
    <div className="pb-20">
      <motion.div
        className="container mx-auto pb-12 px-4 md:px-0"
        variants={headerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="flex flex-col gap-4 justify-center items-center"
          variants={headerItemVariants}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-medium text-primary text-center max-w-4xl"
            variants={headerItemVariants}
          >
            EMBARK ON YOUR DECENTRALIZED TRADING JOURNEY
          </motion.h2>
          <motion.p
            className="text-gray-300 text-base md:text-lg text-center"
            variants={headerItemVariants}
          >
            Discover our growing range of Perpetual Contract markets
          </motion.p>
        </motion.div>
      </motion.div>
      <div className="border-y-0 md:border-y border-primary/40">
        <div className="container mx-auto px-4 md:px-0">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4"
            variants={productsContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                className={`flex flex-col gap-8 border-primary/40 px-4 py-6  md:p-8  ${
                  index < products.length - 1
                    ? "border md:border-b-0 md:border-l"
                    : "border md:border-r md:border-l"
                }`}
                variants={productItemVariants}
              >
                <div className="flex-1 flex flex-col gap-6 md:gap-4 pb-0 md:pb-12">
                  <motion.div className="mt-0 md:mt-4">
                    {product.icon}
                  </motion.div>
                  <h3
                    className="text-xl md:text-3xl font-medium text-white hidden md:block"
                    dangerouslySetInnerHTML={{ __html: product.title }}
                  ></h3>
                  <h3 className="text-xl md:text-2xl font-medium text-white block md:hidden">
                    {index === 3 ? "Unified liquidity" : product.title}
                  </h3>
                  <p className="text-gray-300">{product.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Section4;
