"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import CalendarView from "@/components/calendar-view";
import StatsView from "@/components/stats-view";
import YearView from "@/components/year-view";
import { initialData } from "@/lib/data";
import PersonaTransition from "@/components/ui/persona-transition";
import useSound from "use-sound";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Home() {
  const [data, setData] = useState(initialData);
  const [currentTab, setCurrentTab] = useState("calendar");
  const [previousTab, setPreviousTab] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [playTabChange] = useSound("/sounds/tab-change.wav", { volume: 0.3 });

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = localStorage.getItem("persona4Data");
    if (savedData) {
      setData(JSON.parse(savedData));
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("persona4Data", JSON.stringify(data));
  }, [data]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setPreviousTab(currentTab);
    setCurrentTab(value);
    playTabChange();
  };

  // Get transition type based on tab change
  const getTransitionType = (tab: string) => {
    if (tab === "stats") return "fade";
    if (tab === "calendar") return "zoom";
    if (tab === "year") return "whoosh";
    return "slide";
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen bg-[#FFC107] p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <motion.header
          className="mb-6 text-center"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <h1 className="text-3xl md:text-5xl font-bold text-black tracking-tight font-persona">PERSONA 4</h1>
          <p className="text-lg md:text-xl font-medium text-black/80">Daily Life Simulator</p>
        </motion.header>

        <motion.div
          className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
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

          <Tabs defaultValue="calendar" value={currentTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full h-14 bg-black rounded-none">
              <TabsTrigger
                value="calendar"
                className="w-1/3 h-full text-lg font-bold rounded-none data-[state=active]:bg-[#FFC107] data-[state=active]:text-black text-white"
              >
                CALENDAR
              </TabsTrigger>
              <TabsTrigger
                value="year"
                className="w-1/3 h-full text-lg font-bold rounded-none data-[state=active]:bg-[#D32F2F] data-[state=active]:text-white text-white"
              >
                YEAR
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="w-1/3 h-full text-lg font-bold rounded-none data-[state=active]:bg-[#1976D2] data-[state=active]:text-white text-white"
              >
                STATS
              </TabsTrigger>
            </TabsList>

            <div className="relative">
              <TabsContent value="calendar" className="p-0 m-0">
                <PersonaTransition isActive={currentTab === "calendar"} transitionType={getTransitionType("calendar")}>
                  <CalendarView data={data} setData={setData} />
                </PersonaTransition>
              </TabsContent>
              <TabsContent value="year" className="p-0 m-0">
                <PersonaTransition isActive={currentTab === "year"} transitionType={getTransitionType("year")}>
                  <YearView data={data} />
                </PersonaTransition>
              </TabsContent>
              <TabsContent value="stats" className="p-0 m-0">
                <PersonaTransition isActive={currentTab === "stats"} transitionType={getTransitionType("stats")}>
                  <StatsView data={data} />
                </PersonaTransition>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
