"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { format, getYear, isSameMonth, isSameYear } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import type { DataType } from "@/lib/types"
import PersonaButton from "@/components/ui/persona-button"
import useSound from "use-sound"

interface YearViewProps {
  data: DataType
}

export default function YearView({ data }: YearViewProps) {
  const [currentYear, setCurrentYear] = useState(getYear(new Date()))
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const [playYearChange] = useSound("/sounds/page-turn.mp3", { volume: 0.5 })

  // Navigate to previous year
  const prevYear = () => {
    setDirection("left")
    playYearChange()
    setCurrentYear(currentYear - 1)
  }

  // Navigate to next year
  const nextYear = () => {
    setDirection("right")
    playYearChange()
    setCurrentYear(currentYear + 1)
  }

  // Get all months
  const months = Array.from({ length: 12 }).map((_, index) => {
    const date = new Date(currentYear, index, 1)
    return date
  })

  // Get activity counts for a specific month
  const getMonthActivitySummary = (month: Date) => {
    const activitiesInMonth = data.activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return isSameMonth(activityDate, month) && isSameYear(activityDate, month)
    })

    // Count activities by type
    const counts: Record<string, number> = {}
    activitiesInMonth.forEach((activity) => {
      const type = activity.activityType || "Other"
      counts[type] = (counts[type] || 0) + 1
    })

    return {
      total: activitiesInMonth.length,
      counts,
    }
  }

  // Get color for activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "Study":
        return "#dbeafe" // blue-100
      case "Social":
        return "#dcfce7" // green-100
      case "Work":
        return "#fef9c3" // yellow-100
      case "Training":
        return "#fee2e2" // red-100
      case "Reading":
        return "#f3e8ff" // purple-100
      case "Rest":
        return "#f3f4f6" // gray-100
      default:
        return "#e5e7eb" // gray-200
    }
  }

  // Get stat changes for a specific month
  const getMonthStatChanges = (month: Date) => {
    const activitiesInMonth = data.activities.filter((activity) => {
      const activityDate = new Date(activity.date)
      return isSameMonth(activityDate, month) && isSameYear(activityDate, month) && activity.statChanges
    })

    // Sum up stat changes
    const statChanges = {
      Knowledge: 0,
      Expression: 0,
      Diligence: 0,
      Understanding: 0,
      Courage: 0,
    }

    activitiesInMonth.forEach((activity) => {
      if (activity.statChanges) {
        Object.entries(activity.statChanges).forEach(([stat, value]) => {
          statChanges[stat as keyof typeof statChanges] += value
        })
      }
    })

    return statChanges
  }

  // Animation variants for year transition
  const yearVariants = {
    initial: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      opacity: 0,
      rotate: direction === "left" ? -5 : direction === "right" ? 5 : 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      rotate: 0,
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      opacity: 0,
      rotate: direction === "left" ? 5 : direction === "right" ? -5 : 0,
    }),
  }

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-[#D32F2F]/90 to-[#B71C1C]/90 relative">
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "url('/textures/noise.png')",
          backgroundRepeat: "repeat",
          mixBlendMode: "overlay",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <PersonaButton
            onClick={prevYear}
            variant="outline"
            className="h-14 w-14 p-0 rounded-none border-2 border-black bg-[#1976D2] hover:bg-[#1565C0] text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </PersonaButton>

          <div className="text-center bg-black text-white px-6 py-2 border-2 border-white">
            <h2 className="text-2xl md:text-3xl font-bold">{currentYear}</h2>
            <p className="text-base md:text-lg font-medium">Yearly Summary</p>
          </div>

          <PersonaButton
            onClick={nextYear}
            variant="outline"
            className="h-14 w-14 p-0 rounded-none border-2 border-black bg-[#1976D2] hover:bg-[#1565C0] text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </PersonaButton>
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentYear}
            custom={direction}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={yearVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {months.map((month, index) => {
              const summary = getMonthActivitySummary(month)
              const statChanges = getMonthStatChanges(month)

              return (
                <motion.div
                  key={index}
                  className="border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Month header */}
                  <div className="bg-black text-white p-2 text-center">
                    <h3 className="font-bold text-lg">{format(month, "MMMM")}</h3>
                  </div>

                  {/* Activity summary */}
                  <div className="p-3">
                    <div className="text-sm font-medium mb-2">Activities: {summary.total}</div>

                    {/* Activity type bars */}
                    <div className="space-y-2">
                      {Object.entries(summary.counts).map(([type, count]) => (
                        <div key={type} className="flex items-center space-x-2">
                          <div className="text-xs w-16 truncate">{type}:</div>
                          <div className="flex-1 h-4 bg-gray-200 rounded-sm overflow-hidden border border-black">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(100, (count / summary.total) * 100)}%` }}
                              transition={{ duration: 0.5, delay: index * 0.05 }}
                              className="h-full"
                              style={{
                                backgroundColor: getActivityColor(type),
                              }}
                            />
                          </div>
                          <div className="text-xs w-6 text-right">{count}</div>
                        </div>
                      ))}
                    </div>

                    {/* Stat changes */}
                    {Object.entries(statChanges).some(([_, value]) => value > 0) && (
                      <div className="mt-3 pt-2 border-t border-gray-200">
                        <div className="text-xs font-medium mb-1">Stat Gains:</div>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(statChanges).map(([stat, value]) =>
                            value > 0 ? (
                              <motion.div
                                key={stat}
                                className="text-xs px-1.5 py-0.5 bg-[#D32F2F] text-white rounded-sm border border-black"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.05 + 0.2 }}
                              >
                                {stat} +{value}
                              </motion.div>
                            ) : null,
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
