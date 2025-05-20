"use client"

import { format } from "date-fns"
import { useState } from "react"
import { motion } from "framer-motion"
import type { Activity } from "@/lib/types"
import { Cloud, CloudRain, Sun } from "lucide-react"
import useSound from "use-sound"

interface DayBlockProps {
  date: Date
  activities: Activity[]
  isWeekday: boolean
}

export default function DayBlock({ date, activities, isWeekday }: DayBlockProps) {
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null)
  const [playHover] = useSound("/sounds/hover.mp3", { volume: 0.3 })

  // Get activities for each time of day
  const morningActivity = activities.find((a) => a.timeOfDay === "Morning")
  const afternoonActivity = activities.find((a) => a.timeOfDay === "Afternoon")
  const eveningActivity = activities.find((a) => a.timeOfDay === "Evening")

  // Get weather for the day (using the first activity with weather data)
  const weather = activities.find((a) => a.weather)?.weather || "Sunny"

  // Weather icon component
  const WeatherIcon = () => {
    switch (weather) {
      case "Rainy":
        return <CloudRain className="h-5 w-5 text-[#1976D2]" />
      case "Cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "Sunny":
      default:
        return <Sun className="h-5 w-5 text-[#FFC107]" />
    }
  }

  // Get background color based on activity type
  const getActivityColor = (activity?: Activity) => {
    if (!activity) return "white"

    switch (activity.activityType) {
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
        return "white"
    }
  }

  // Render activity block with hover effect
  const renderActivityBlock = (timeOfDay: string, activity?: Activity, isWorkTime = false) => {
    const isHovered = hoveredActivity === `${timeOfDay}-${activity?.activity}`

    const handleMouseEnter = () => {
      if (activity) {
        setHoveredActivity(`${timeOfDay}-${activity.activity}`)
        playHover()
      }
    }

    return (
      <motion.div
        className="relative p-3 border-2 border-black transition-all duration-200"
        style={{
          backgroundColor: isWorkTime ? "#f3f4f6" : activity ? getActivityColor(activity) : "white",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setHoveredActivity(null)}
        whileHover={{ scale: 1.03 }}
        animate={isHovered ? { boxShadow: "0 0 0 2px rgba(255,255,255,0.8)" } : {}}
      >
        <div className="text-xs font-bold">{timeOfDay}</div>
        <div className="text-sm font-medium">{isWorkTime ? "Work" : activity?.activity || "Free"}</div>

        {/* Show details on hover - absolutely positioned */}
        {isHovered && activity?.details && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-10 left-0 right-0 mx-auto w-max max-w-[200%] -bottom-1 transform translate-y-full text-xs bg-black text-white p-1.5 rounded-sm shadow-md border border-white"
          >
            {activity.details}
          </motion.div>
        )}

        {/* Pulse effect when hovered */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.2, 0], scale: [0.8, 1.1, 1.2] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="absolute inset-0 bg-white pointer-events-none"
          />
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      className="border-3 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {/* Day header */}
      <div className="bg-black text-white p-2 flex justify-between items-center">
        <span className="font-bold">{format(date, "EEE")}</span>
        <span>{format(date, "d")}</span>
        <WeatherIcon />
      </div>

      {/* Time blocks */}
      <div className="p-2 space-y-3">
        {/* Morning */}
        {renderActivityBlock("Morning", morningActivity, isWeekday)}

        {/* Afternoon */}
        {renderActivityBlock("Afternoon", afternoonActivity, isWeekday)}

        {/* Evening */}
        {renderActivityBlock("Evening", eveningActivity)}
      </div>
    </motion.div>
  )
}
