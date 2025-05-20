"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addWeeks, subWeeks, startOfWeek, addDays, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import DayBlock from "@/components/day-block";
import type { DataType } from "@/lib/types";
import PersonaButton from "@/components/ui/persona-button";
import useSound from "use-sound";

interface CalendarViewProps {
  data: DataType;
  setData: React.Dispatch<React.SetStateAction<DataType>>;
}

export default function CalendarView({ data, setData }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(currentDate, { weekStartsOn: 1 }));
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [playWeekChange] = useSound("/sounds/whoosh.mp3", { volume: 0.4 });

  // Update week start date when current date changes
  useEffect(() => {
    setCurrentWeekStart(startOfWeek(currentDate, { weekStartsOn: 1 }));
  }, [currentDate]);

  // Navigate to previous week
  const prevWeek = () => {
    setDirection("left");
    playWeekChange();
    setCurrentDate(subWeeks(currentDate, 1));
  };

  // Navigate to next week
  const nextWeek = () => {
    setDirection("right");
    playWeekChange();
    setCurrentDate(addWeeks(currentDate, 1));
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevWeek();
      } else if (e.key === "ArrowRight") {
        nextWeek();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentDate]);

  // Generate days of the week
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const day = addDays(currentWeekStart, index);
    return day;
  });

  // Get week number (approximate)
  const weekNumber = Math.ceil(currentDate.getDate() / 7);

  // Animation variants for week transition
  const weekVariants = {
    initial: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? -100 : direction === "right" ? 100 : 0,
      opacity: 0,
      filter: "blur(8px)",
    }),
    animate: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
    exit: (direction: "left" | "right" | null) => ({
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      opacity: 0,
      filter: "blur(8px)",
    }),
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-[#FFC107]/90 to-[#FF9800]/90 relative">
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
            onClick={prevWeek}
            variant="outline"
            className="h-14 w-14 p-0 rounded-none border-2 border-black bg-[#1976D2] hover:bg-[#1565C0] text-white"
          >
            <ChevronLeft className="h-8 w-8" />
          </PersonaButton>

          <div className="text-center bg-black text-white px-6 py-2 border-2 border-white">
            <h2 className="text-2xl md:text-3xl font-bold">{format(currentDate, "MMMM yyyy")}</h2>
            <p className="text-base md:text-lg font-medium">Week {weekNumber}</p>
          </div>

          <PersonaButton
            onClick={nextWeek}
            variant="outline"
            className="h-14 w-14 p-0 rounded-none border-2 border-black bg-[#1976D2] hover:bg-[#1565C0] text-white"
          >
            <ChevronRight className="h-8 w-8" />
          </PersonaButton>
        </div>

        <motion.div
          key={currentWeekStart.toString()}
          custom={direction}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={weekVariants}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="grid grid-cols-7 gap-3 md:gap-5"
        >
          {weekDays.map((day, index) => {
            const dayActivities = data.activities.filter((activity) => isSameDay(new Date(activity.date), day));

            // Monday is index 0, Friday is index 4
            return <DayBlock key={index} date={day} activities={dayActivities} isWeekday={index >= 0 && index < 5} />;
          })}
        </motion.div>

        {/* Whoosh effect */}
        {direction && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
          >
            <div className="relative w-full h-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0.7,
                    x: direction === "right" ? -100 : 100,
                    y: Math.random() * 100 - 50,
                    scaleX: direction === "right" ? 5 : -5,
                    scaleY: 0.1,
                  }}
                  animate={{
                    opacity: 0,
                    x: direction === "right" ? 100 : -100,
                    scaleX: direction === "right" ? 10 : -10,
                  }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                  className="absolute bg-white/80 h-2 w-10 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
