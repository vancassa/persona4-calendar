"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PersonaTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  transitionType?: "slide" | "whoosh" | "fade" | "zoom" | "flip";
  className?: string;
}

export default function PersonaTransition({
  children,
  isActive,
  transitionType = "slide",
  className,
}: PersonaTransitionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  // Different animation variants based on transition type
  const variants = {
    slide: {
      initial: { opacity: 0, x: 50, y: 20, rotate: 15, scale: 0.9 },
      animate: { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 },
      exit: { opacity: 0, x: -50, y: 20, rotate: -15, scale: 0.9 },
    },
    whoosh: {
      initial: { opacity: 0, x: 100, filter: "blur(15px)" },
      animate: { opacity: 1, x: 0, filter: "blur(0px)" },
      exit: { opacity: 0, x: -100, filter: "blur(15px)" },
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    },
    zoom: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.8 },
    },
    flip: {
      initial: { opacity: 0, rotateY: 180 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -180 },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={transitionType}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants[transitionType]}
          transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
          className={cn("w-full", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
