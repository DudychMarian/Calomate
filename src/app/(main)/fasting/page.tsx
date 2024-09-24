"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Apple, Coffee, Droplet, Utensils, Moon, Sun, Heart, Brain, Dna, Settings, Clock, Calendar, BarChart } from "lucide-react"
import { format, addSeconds, parseISO } from "date-fns"

const fastingSchedules = [
  { name: "16/8", fasting: 16, eating: 8 },
  { name: "18/6", fasting: 18, eating: 6 },
  { name: "20/4", fasting: 20, eating: 4 },
  { name: "22/2", fasting: 22, eating: 2 },
  { name: "OMAD", fasting: 23, eating: 1 },
]

const fastingPhases = [
  { name: "Fed State", duration: 0, icon: Utensils, description: "Your body is actively digesting and absorbing nutrients from your last meal.", tip: "Focus on nutrient-dense foods during your eating window to maximize nutritional intake." },
  { name: "Early Fasting", duration: 4, icon: Coffee, description: "Your body begins to shift from using glucose as its primary fuel source.", tip: "Stay hydrated with water, black coffee, or herbal tea to help manage hunger." },
  { name: "Fasting", duration: 12, icon: Droplet, description: "Your body starts to burn fat for energy as glucose stores are depleted.", tip: "Engage in light activities to distract yourself from hunger and boost fat burning." },
  { name: "Long-Term Fasting", duration: 16, icon: Heart, description: "Autophagy increases, promoting cellular repair and renewal.", tip: "Listen to your body. If you feel unwell, consider breaking your fast." },
  { name: "Extended Fasting", duration: 24, icon: Brain, description: "Growth hormone levels increase, potentially improving muscle growth and repair.", tip: "Supplement with electrolytes to maintain proper hydration and mineral balance." },
  { name: "Prolonged Fasting", duration: 48, icon: Dna, description: "Significant increase in autophagy and potential stem cell regeneration.", tip: "Only attempt prolonged fasts under medical supervision." },
]

const centerIcons = [
  { name: "Apple", icon: Apple },
  { name: "Coffee", icon: Coffee },
  { name: "Water", icon: Droplet },
  { name: "Moon", icon: Moon },
  { name: "Sun", icon: Sun },
]

export default function FastingPage() {
  const [selectedSchedule, setSelectedSchedule] = useState(fastingSchedules[0])
  const [isActive, setIsActive] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [centerIcon, setCenterIcon] = useState(centerIcons[0])
  const [showSettings, setShowSettings] = useState(false)
  const [startTime, setStartTime] = useState(new Date())
  const [editStartTime, setEditStartTime] = useState(format(new Date(), "yyyy-MM-dd'T'HH:mm"))
  const [fastingStats, setFastingStats] = useState({ totalFasts: 0, totalTime: 0, longestFast: 0 })

  useEffect(() => {
    const storedData = localStorage.getItem('fastingData')
    if (storedData) {
      const { selectedSchedule, isActive, timeElapsed, centerIcon, startTime, fastingStats } = JSON.parse(storedData)
      setSelectedSchedule(selectedSchedule)
      setIsActive(isActive)
      setCenterIcon(centerIcon)
      setFastingStats(fastingStats)
      if (isActive) {
        const storedStartTime = new Date(startTime)
        setStartTime(storedStartTime)
        const elapsedSinceLastVisit = Math.floor((Date.now() - storedStartTime.getTime()) / 1000)
        setTimeElapsed(elapsedSinceLastVisit)
      } else {
        setTimeElapsed(timeElapsed)
      }
    }
  }, [])

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => {
          const newTime = prevTime + 1
          if (newTime >= selectedSchedule.fasting * 3600) {
            clearInterval(interval)
            setIsActive(false)
            handleFinish()
            return selectedSchedule.fasting * 3600
          }
          return newTime
        })
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isActive, selectedSchedule])

  useEffect(() => {
    localStorage.setItem('fastingData', JSON.stringify({
      selectedSchedule,
      isActive,
      timeElapsed,
      centerIcon,
      startTime: startTime.toISOString(),
      fastingStats
    }))
  }, [selectedSchedule, isActive, timeElapsed, centerIcon, startTime, fastingStats])

  const handleStart = () => {
    setIsActive(true)
    setTimeElapsed(0)
    setStartTime(new Date())
  }

  const handleFinish = () => {
    setIsActive(false)
    const fastingInfo = {
      schedule: selectedSchedule.name,
      duration: timeElapsed,
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString()
    }
    console.log("Fasting info:", fastingInfo)
    setFastingStats(prev => ({
      totalFasts: prev.totalFasts + 1,
      totalTime: prev.totalTime + timeElapsed,
      longestFast: Math.max(prev.longestFast, timeElapsed)
    }))
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const calculateProgress = () => {
    return (timeElapsed / (selectedSchedule.fasting * 3600)) * 100
  }

  const getCurrentPhase = () => {
    const hoursElapsed = timeElapsed / 3600
    return fastingPhases.reduce((acc, phase) => (hoursElapsed >= phase.duration ? phase : acc), fastingPhases[0])
  }

  const handleEditStartTime = () => {
    const newStartTime = parseISO(editStartTime)
    setStartTime(newStartTime)
    const newTimeElapsed = Math.floor((Date.now() - newStartTime.getTime()) / 1000)
    setTimeElapsed(newTimeElapsed)
    setShowSettings(false)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Fasting Timer</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <div className="relative w-64 h-64 mx-auto">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: calculateProgress() / 100 }}
                  transition={{ duration: 0.5 }}
                  style={{ rotate: -90, transformOrigin: "center" }}
                />
                {fastingPhases.map((phase, index) => {
                  const angle = (phase.duration / selectedSchedule.fasting) * 360 - 90
                  return (
                    <TooltipProvider key={phase.name}>
                      <Tooltip>
                        <TooltipTrigger>
                          <g transform={`rotate(${angle} 50 50)`}>
                            <line x1="50" y1="5" x2="50" y2="15" stroke="#4b5563" strokeWidth="2" />
                            <g transform={`translate(${50 + 38 * Math.cos((angle + 90) * Math.PI / 180)}, ${50 + 38 * Math.sin((angle + 90) * Math.PI / 180)})`}>
                              <circle cx="0" cy="0" r="3" fill="#4b5563" />
                              <foreignObject x="-8" y="-8" width="16" height="16">
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                                  <phase.icon className="w-4 h-4 text-blue-500" />
                                </div>
                              </foreignObject>
                            </g>
                          </g>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{phase.name}</p>
                          <p className="text-sm text-muted-foreground">Starts at {phase.duration} hours</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
                <g transform="translate(50, 50)">
                  <foreignObject x="-16" y="-16" width="32" height="32">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                      {/* <centerIcon.icon className="w-5 h-5 text-blue-500" /> */}
                    </div>
                  </foreignObject>
                </g>
              </svg>
              <div className="absolute top-0 right-0 mt-2 mr-2">
                <Popover open={showSettings} onOpenChange={setShowSettings}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Fasting Schedule</h4>
                        <Select
                          value={selectedSchedule.name}
                          onValueChange={(value) => {
                            const newSchedule = fastingSchedules.find(schedule => schedule.name === value)
                            if (newSchedule) setSelectedSchedule(newSchedule)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a schedule" />
                          </SelectTrigger>
                          <SelectContent>
                            {fastingSchedules.map((schedule) => (
                              <SelectItem key={schedule.name} value={schedule.name}>
                                {schedule.name} ({schedule.fasting}/{schedule.eating})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Center Icon</h4>
                        <Select
                          value={centerIcon.name}
                          onValueChange={(value) => {
                            const newIcon = centerIcons.find(icon => icon.name === value)
                            if (newIcon) setCenterIcon(newIcon)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select an icon" />
                          </SelectTrigger>
                          <SelectContent>
                            {centerIcons.map((icon) => (
                              <SelectItem key={icon.name} value={icon.name}>
                                <div className="flex items-center">
                                  <icon.icon className="mr-2 h-4 w-4" />
                                  {icon.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Edit Start Time</h4>
                        <div className="flex space-x-2">
                          <Input
                            type="datetime-local"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                          />
                          <Button onClick={handleEditStartTime}>Update</Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-3xl font-bold mb-4">{formatTime(timeElapsed)}</p>
              <div className="flex justify-center space-x-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Start Time</p>
                  <p>{format(startTime, "MMM d, yyyy HH:mm")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Time</p>
                  <p>{format(addSeconds(startTime, selectedSchedule.fasting * 3600), "MMM d, yyyy HH:mm")}</p>
                </div>
              </div>
              <Button onClick={isActive ? handleFinish : handleStart} className="w-32">
                {isActive ? "Finish" : "Start"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Phase: {getCurrentPhase().name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{getCurrentPhase().description}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fasting Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Fasts</p>
                  <p className="text-2xl font-bold">{fastingStats.totalFasts}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Fasting Time</p>
                  <p className="text-2xl font-bold">{formatTime(fastingStats.totalTime)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <BarChart className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Longest Fast</p>
                  <p className="text-2xl font-bold">{formatTime(fastingStats.longestFast)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fasting Phases</CardTitle>
            <CardDescription>Learn about the different phases of fasting</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {fastingPhases.map((phase) => {
                const currentPhase = getCurrentPhase()
                const isCurrentPhase = currentPhase.name === phase.name
                return (
                  <li
                    key={phase.name}
                    className={`bg-secondary rounded-lg p-4 transition-colors duration-300 ${isCurrentPhase ? 'bg-primary text-primary-foreground' : ''
                      }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isCurrentPhase ? 'bg-primary-foreground' : 'bg-primary'
                        }`}>
                        <phase.icon className={`w-5 h-5 ${isCurrentPhase ? 'text-primary' : 'text-primary-foreground'
                          }`} />
                      </div>
                      <h3 className="text-lg font-semibold">{phase.name}</h3>
                      <span className={`ml-auto text-sm ${isCurrentPhase ? 'text-primary-foreground' : 'text-muted-foreground'
                        }`}>
                        Starts at {phase.duration} hours
                      </span>
                    </div>
                    <p className="mb-2">{phase.description}</p>
                    <p className={`text-sm ${isCurrentPhase ? 'text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                      Tip: {phase.tip}
                    </p>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}