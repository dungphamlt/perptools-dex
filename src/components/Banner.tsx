"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import BannerLogo from "../assets/images/Banner-logo.svg?url";
import { useRouter } from "next/navigation";
const MotionImage = motion(Image);
function Banner() {
  const router = useRouter();
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
    hidden: { opacity: 0, x: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <div className="">
      <div className="container mx-auto py-10 px-4 md:px-0 md:py-14">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="flex flex-col justify-center gap-8"
            variants={itemVariants}
          >
            <div className="">
              <motion.h2
                className="text-primary md:text-[52px] text-3xl font-medium mb-2"
                variants={itemVariants}
              >
                AI meets DeFi
              </motion.h2>
              <motion.h2
                className="text-white md:text-[52px] text-3xl font-medium"
                variants={itemVariants}
              >
                Perpetuals Reinvented
              </motion.h2>
            </div>
            <motion.p
              className="text-white text-base md:text-lg"
              variants={itemVariants}
            >
              Trade smarter with autonomous agents, real on-chain transparency,
              and CEX-grade performance — without giving up control
            </motion.p>
            <motion.div
              className="hidden md:flex gap-4 flex-wrap"
              variants={itemVariants}
            >
              <motion.button
                className="flex font-semibold items-center gap-1 px-4 py-2 rounded-md bg-gradient-to-b from-[#2BB9F3] to-[#83D4FB] text-black hover:bg-gradient-to-b hover:from-primary hover:to-primary transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Launch App</span>
                <ChevronRight className="w-6 h-6" />
              </motion.button>
              <motion.button
                onClick={() => router.push("/npt-sale")}
                className="px-8 py-2 font-semibold rounded-md bg-white text-black hover:bg-primary transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                NFT Sale
              </motion.button>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex items-center justify-center my-12 md:my-0"
            variants={imageVariants}
          >
            <MotionImage
              src={BannerLogo}
              alt="Banner Logo"
              width={600}
              height={600}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
          <motion.div
            className="flex md:hidden justify-center gap-8"
            variants={itemVariants}
          >
            <motion.button
              className="flex font-semibold items-center gap-1 px-4 py-2 rounded-md bg-gradient-to-b from-[#2BB9F3] to-[#83D4FB] text-black hover:bg-gradient-to-b hover:from-primary hover:to-primary transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Launch App</span>
              <ChevronRight className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={() => router.push("/npt-sale")}
              className="px-8 py-2 font-semibold rounded-md bg-white text-black hover:bg-primary transition-colors cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              NFT Sale
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Banner;
