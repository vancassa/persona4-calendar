"use client"

import { motion } from "framer-motion"

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#FFC107] z-50">
      <div className="relative w-32 h-32">
        {/* Persona 4 logo spinner */}
        <motion.div
          className="absolute inset-0 border-8 border-black rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />

        <motion.div
          className="absolute inset-2 bg-white rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div
            className="text-2xl font-bold text-black"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          >
            P4
          </motion.div>
        </motion.div>

        {/* Particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-black"
            style={{
              top: "50%",
              left: "50%",
              borderRadius: i % 2 === 0 ? "0%" : "50%",
            }}
            animate={{
              x: [0, Math.cos(i * 45 * (Math.PI / 180)) * 60],
              y: [0, Math.sin(i * 45 * (Math.PI / 180)) * 60],
              opacity: [1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.1,
              repeatType: "loop",
            }}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-20 text-black text-xl font-bold"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        LOADING...
      </motion.div>
    </div>
  )
}
