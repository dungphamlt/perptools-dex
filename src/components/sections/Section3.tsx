"use client";

import { motion } from "framer-motion";
import Ai1 from "../../assets/icons/ai1.svg";
import Ai2 from "../../assets/icons/ai2.svg";
import AiAgentImage from "../../assets/images/ai-agents.svg?url";
import AiAgentImageMobile from "../../assets/images/ai-agents-mobile.svg?url";
import Image from "next/image";
const MotionImage = motion(Image);
function Section3() {
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

  const cardsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: 0.3,
      },
    },
  };

  const cards = [
    {
      icon: Ai1,
      title: "Testing Pipeline",
      description:
        "2-year backtests for accuracy → paper trading for bias removal → live capital testing.Fully automated framework enables seamless transition from simulation to market.",
    },
    {
      icon: Ai2,
      title: "Execution Logic",
      description:
        "Agents act as disciplined day traders — wait for signal, enter, manage risk, exit, reinvest. Two-level risk control (per-position & per-deposit) wit",
    },
  ];

  return (
    <div className="container mx-auto pb-20 px-4 md:px-0">
      <motion.div
        className="flex flex-col justify-center items-center gap-4 mb-12"
        variants={headerContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-medium text-primary"
          variants={itemVariants}
        >
          AI Agent
        </motion.h2>
        <motion.p
          className="text-gray-300 text-base md:text-lg"
          variants={itemVariants}
        >
          Smart automation for smarter decisions
        </motion.p>
      </motion.div>
      <div className=" border-0 md:border border-primary/40 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="md:hidden px-4 pt-4 border border-primary/40 rounded-xl">
          <MotionImage
            src={AiAgentImageMobile}
            width={500}
            height={500}
            alt="AI Agent"
            className="w-full h-full object-cover"
          />
        </div>
        <motion.div
          className="p-0 md:py-6  md:pl-8"
          variants={cardsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                className="border border-primary/40 rounded-xl p-4 mb-6 last:mb-0"
                variants={cardVariants}
                transition={{ duration: 0.2 }}
              >
                <IconComponent className="w-12 h-12" />
                <h3 className="text-2xl font-medium text-primary my-4">
                  {card.title}
                </h3>
                <p className="text-gray-300 text-base md:text-lg ">
                  {card.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
        <motion.div
          className="pt-7 hidden md:block"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={imageVariants}>
            <MotionImage
              src={AiAgentImage}
              width={500}
              height={500}
              alt="AI Agent"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default Section3;
