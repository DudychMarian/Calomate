"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { GlassWater } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const GLASS_VOLUME = 250 // ml
const DAILY_GOAL = 2000 // ml
const INITIAL_GLASSES = 8

type WaterTrackerProps = { showTitle: boolean, showProgress: boolean, showGlassCount: boolean, hide?: boolean }

export default function WaterTracker({ showTitle, showProgress, showGlassCount, hide }: WaterTrackerProps) {
  const [waterIntake, setWaterIntake] = useState(0)
  const [filledGlasses, setFilledGlasses] = useState(0)
  const [totalGlasses, setTotalGlasses] = useState(INITIAL_GLASSES)

  const handleGlassClick = (glassIndex: number) => {
    const newFilledGlasses = glassIndex + 1
    const newWaterIntake = newFilledGlasses * GLASS_VOLUME

    setFilledGlasses(newFilledGlasses)
    setWaterIntake(newWaterIntake)

    if (newWaterIntake >= DAILY_GOAL && waterIntake < DAILY_GOAL) {
      toast("Daily Goal Achieved!", {
        description: "Congratulations! You've reached your daily water intake goal. 🎉",
      })
    }

    if (newFilledGlasses === totalGlasses) {
      setTotalGlasses(totalGlasses + 1)
    }
  }

  const resetTracker = () => {
    setWaterIntake(0)
    setFilledGlasses(0)
    setTotalGlasses(INITIAL_GLASSES)
  }

  return (
    <>
      {!hide && (<div className="border rounded-lg p-4 bg-white border-[#F4F5F6]">
        {showTitle && <h2 className="text-2xl font-bold mb-4">Water Intake Tracker</h2>}
        {showProgress && <div className="mb-6">
          <Progress value={(waterIntake / DAILY_GOAL) * 100} className="h-4" />
          <p className="text-sm text-muted-foreground mt-2">
            {waterIntake} ml / {DAILY_GOAL} ml
          </p>
        </div>}
        <div className="grid grid-cols-8 gap-4 mb-6">
          {Array.from({ length: totalGlasses }).map((_, index) => (
            <Button
              key={index}
              variant="outline"
              className="p-0 w-16 h-20 relative overflow-hidden"
              onClick={() => handleGlassClick(index)}
            >
              <motion.div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial={{ color: "#000" }}
                animate={{ color: index < filledGlasses ? "#3b82f6" : "#000" }} // Blue color for filled glasses
                transition={{ duration: 0.3 }}
              >
                <GlassWater className="w-8 h-8" />
              </motion.div>
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          {
            showGlassCount && <p className="text-sm font-medium">
              Glasses: {filledGlasses} / {totalGlasses}
            </p>
          }
          <Button variant="outline" onClick={resetTracker}>
            Reset
          </Button>
        </div>
      </div>)}
    </>
  )
}