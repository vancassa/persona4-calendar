"use client";

import { motion } from "framer-motion";
import type { DataType } from "@/lib/types";
import useSound from "use-sound";

interface StatsViewProps {
  data: DataType;
}

export default function StatsView({ data }: StatsViewProps) {
  const { stats } = data;
  const [playStatHover] = useSound("/sounds/stat-hover.mp3", { volume: 1 });

  // Function to render stat bars
  const renderStatBars = (value: number, max = 5, statName: string) => {
    return (
      <div className="flex space-x-1">
        {Array.from({ length: max }).map((_, i) => (
          <motion.div
            key={i}
            className={`h-5 w-7 border-2 border-black ${i < value ? "bg-[#D32F2F]" : "bg-gray-200"}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={() => {
              if (i < value) {
                playStatHover();
                return { scale: 1.1, y: -2 };
              }
              return {};
            }}
          />
        ))}
      </div>
    );
  };

  // Get recent activities that affected stats
  const recentActivities = data.activities
    .filter((activity) => activity.statChanges && Object.keys(activity.statChanges).length > 0)
    .slice(0, 5);

  return (
    <div className="p-6 bg-gradient-to-br from-[#1976D2]/90 to-[#0D47A1]/90 relative">
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
        <motion.h2
          className="text-2xl font-bold mb-6 border-b-3 border-black pb-2 text-white"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Character Stats
        </motion.h2>

        <div className="grid gap-6">
          {/* Stats display */}
          <div className="grid gap-4 bg-white p-4 border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            <motion.div
              className="flex items-center justify-between"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <span className="font-bold text-lg">Knowledge</span>
              {renderStatBars(stats.Knowledge, 5, "Knowledge")}
            </motion.div>
            <motion.div
              className="flex items-center justify-between"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="font-bold text-lg">Expression</span>
              {renderStatBars(stats.Expression, 5, "Expression")}
            </motion.div>
            <motion.div
              className="flex items-center justify-between"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="font-bold text-lg">Diligence</span>
              {renderStatBars(stats.Diligence, 5, "Diligence")}
            </motion.div>
            <motion.div
              className="flex items-center justify-between"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="font-bold text-lg">Understanding</span>
              {renderStatBars(stats.Understanding, 5, "Understanding")}
            </motion.div>
            <motion.div
              className="flex items-center justify-between"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-bold text-lg">Courage</span>
              {renderStatBars(stats.Courage, 5, "Courage")}
            </motion.div>
          </div>

          {/* Recent activities */}
          <div className="mt-8">
            <motion.h3
              className="text-xl font-bold mb-4 border-b-3 border-black pb-2 text-white"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Recent Activities
            </motion.h3>

            {recentActivities.length > 0 ? (
              <ul className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <motion.li
                    key={index}
                    className="border-3 border-black p-3 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                  >
                    <div className="font-bold">
                      {activity.activity} ({activity.timeOfDay})
                    </div>
                    <div className="text-sm">{new Date(activity.date).toLocaleDateString()}</div>
                    <div className="mt-1 text-sm flex flex-wrap gap-1">
                      {Object.entries(activity.statChanges || {}).map(([stat, change]) => (
                        <motion.span
                          key={stat}
                          className="inline-block px-1.5 py-0.5 bg-[#D32F2F] text-white text-xs rounded-sm border border-black"
                          initial={{ scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                        >
                          {stat} +{change}
                        </motion.span>
                      ))}
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-white">No recent activities affecting stats.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
