"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import BannerSection1 from "../../assets/images/banner-section1.svg?url";
import Union from "../../assets/images/Union.png";
const MotionImage = motion(Image);
interface NumberCounterProps {
  value: string;
  duration?: number;
  isInView: boolean;
}

function NumberCounter({ value, duration = 3, isInView }: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    // Parse value: "$173.37B" -> { number: 173.37, unit: "B", prefix: "$" }
    const match = value.match(/^(\$?)([\d.]+)([BMK]?)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const [, prefix, numStr, unit] = match;
    const targetNumber = parseFloat(numStr);
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNumber = targetNumber * easeOutQuart;

      // Format number with same decimal places as original
      const decimals = numStr.split(".")[1]?.length || 0;
      const formattedNumber = currentNumber.toFixed(decimals);

      setDisplayValue(`${prefix}${formattedNumber}${unit}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animate();
  }, [isInView, value, duration]);

  return <span>{displayValue}</span>;
}

function Section1() {
  const numbersRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(numbersRef, { once: true, amount: 0.3 });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const numbers = [
    {
      title: "Total Trading Volume",
      value: "$173.37B",
    },
    {
      title: "Total Trades",
      value: "223.01M",
    },
    {
      title: "Open Interest",
      value: "48.20M",
    },
  ];

  const numbersContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const numberItemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
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
        duration: 0.6,
        delay: 0.3,
      },
    },
  };

  return (
    <div
      className="container mx-auto pt-20 pb-20 "
      style={
        isMobile
          ? {}
          : {
              backgroundImage: `url(${Union.src})`,
              backgroundSize: "contain",
              backgroundPosition: "top",
              backgroundRepeat: "no-repeat",
            }
      }
    >
      <motion.div
        ref={numbersRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6"
        variants={numbersContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3, margin: "-100px" }}
      >
        {numbers.map((number) => (
          <motion.div
            key={number.title}
            className="flex flex-col items-center justify-center gap-4"
            variants={numberItemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-xl font-semibold text-white">{number.title}</h3>
            <p className="text-4xl md:text-5xl font-medium text-white">
              <NumberCounter value={number.value} isInView={isInView} />
            </p>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="relative pt-[200px] mt-[-150px] md:mt-[-50px] px-4 md:px-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3, margin: "-100px" }}
        style={
          isMobile
            ? {
                backgroundImage: `url(${Union.src})`,
                backgroundSize: "cover",
                backgroundPosition: "top",
                backgroundRepeat: "no-repeat",
              }
            : {}
        }
      >
        <motion.div className="gradient-border" variants={imageVariants}>
          <div className="gradient-border-inner relative">
            <MotionImage
              src={BannerSection1}
              alt="BgTrade"
              width={900}
              height={900}
              className="w-full h-full object-cover rounded-2xl"
              variants={imageVariants}
            />
            <div className="absolute bottom-0 left-0 right-0 h-4/5 bg-gradient-to-t from-black/90 to-transparent rounded-2xl pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Section1;
