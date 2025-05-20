import type React from "react"
import { cn } from "@/lib/utils"

interface PersonaPanelProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "stats" | "calendar" | "year"
}

export default function PersonaPanel({ children, className, variant = "default" }: PersonaPanelProps) {
  // Different gradient backgrounds based on variant
  const gradientStyles = {
    default: "bg-gradient-to-br from-[#FFC107] to-[#FF9800]",
    stats: "bg-gradient-to-br from-[#1976D2] to-[#0D47A1]",
    calendar: "bg-gradient-to-br from-[#FFC107] to-[#FF9800]",
    year: "bg-gradient-to-br from-[#D32F2F] to-[#B71C1C]",
  }

  return (
    <div
      className={cn(
        "relative border-3 border-black rounded-none shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]",
        gradientStyles[variant],
        className,
      )}
    >
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "url('/textures/noise.png')",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
