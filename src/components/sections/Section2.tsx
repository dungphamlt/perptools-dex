"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Roadmap from "../../assets/images/roadmap.svg?url";
import NftMarket from "../../assets/icons/nft-market.svg";
import Platform from "../../assets/icons/platform.svg";
import Farm from "../../assets/icons/farm.svg";
import AiEngine from "../../assets/icons/ai-engine.svg";
import Airdrop from "../../assets/icons/airdrop.svg";
import ToBeContinued from "../../assets/icons/continue.svg";
import ArrowDown from "../../assets/icons/arrow-down.svg?url";
const MotionImage = motion(Image);
function Section2() {
  const roadmap = [
    {
      title: "NFT Sale",
      icon: <NftMarket className="w-14 h-14" />,
    },
    {
      title: "Platform Launch",
      icon: <Platform className="w-14 h-14" />,
    },
    {
      title: "Farm programm launch",
      icon: <Farm className="w-14 h-14" />,
    },
    {
      title: "AI engine Launch",
      icon: <AiEngine className="w-14 h-14" />,
    },
    {
      title: "Airdrop season 1",
      icon: <Airdrop className="w-14 h-14" />,
    },
    {
      title: "To be continued",
      icon: <ToBeContinued className="w-14 h-14" />,
    },
  ];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  const roadmapListVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const roadmapItemVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const arrowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <div className="container mx-auto px-4 md:px-0 pb-20">
      <motion.div
        className="flex flex-col justify-center items-center gap-4 mb-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-medium text-primary"
          variants={itemVariants}
        >
          Roadmap
        </motion.h2>
        <motion.p
          className="text-gray-300 text-base md:text-lg"
          variants={itemVariants}
        >
          Our journey toward innovation and growth
        </motion.p>
      </motion.div>
      <motion.div
        className="border border-primary/40 rounded-xl py-6 md:py-10 px-4 md:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="hidden md:block"
          variants={imageVariants}
          transition={{ duration: 0.3 }}
        >
          <MotionImage
            src={Roadmap}
            alt="Roadmap"
            width={1200}
            height={900}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div
          className="flex flex-col gap-2 md:hidden"
          variants={roadmapListVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {roadmap.map((item, index) => (
            <div key={item.title}>
              <motion.div
                className="flex items-center gap-4"
                variants={roadmapItemVariants}
              >
                <div className="w-14 h-14 relative border-1 border-primary rounded-lg flex items-center justify-center overflow-hidden">
                  <div className="absolute z-10 inset-0 top-1/2 rounded-md bg-gradient-to-t from-primary/30 to-transparent" />
                  <span className="text-primary text-2xl font-semibold">
                    {index + 1}
                  </span>
                </div>

                {item.icon}

                <h3 className="text-base md:text-lg font-semibold text-white">
                  {item.title}
                </h3>
              </motion.div>

              {index !== roadmap.length - 1 && (
                <motion.div
                  className="w-14 flex justify-center"
                  variants={arrowVariants}
                >
                  <Image
                    src={ArrowDown}
                    alt="Arrow Down"
                    width={24}
                    height={24}
                    className="w-6 h-auto object-contain"
                  />
                </motion.div>
              )}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Section2;
