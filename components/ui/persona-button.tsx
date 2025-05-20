"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useSound from "use-sound";

interface PersonaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
  className?: string;
  withSound?: boolean;
}

export default function PersonaButton({
  variant = "default",
  size = "default",
  children,
  className,
  withSound = true,
  ...props
}: PersonaButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.5 });

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (withSound) playHover();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (props.onClick) props.onClick(e);
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
      <Button
        variant={variant}
        size={size}
        className={cn(
          "relative transition-all duration-200 border-2 border-black",
          isHovered && "shadow-[0_0_0_2px_rgba(255,255,255,0.8)]",
          className
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />
        </motion.div>
      )}
    </motion.div>
  );
}
