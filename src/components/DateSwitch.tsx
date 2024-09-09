"use client"

import { useState, useCallback } from "react"
import { format, addDays, subDays, isToday, isTomorrow, isYesterday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type CalendarDay = [year: number, month: number, day: number]

const dateToCalendarDay = (date: Date): CalendarDay => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()
]

const calendarDayToDate = ([year, month, day]: CalendarDay): Date =>
  new Date(year, month - 1, day)

export default function DateSwitch() {
  const [currentDate, setCurrentDate] = useState<CalendarDay>(dateToCalendarDay(new Date()))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const goToPreviousDay = useCallback(() => {
    setCurrentDate((prevDate) => dateToCalendarDay(subDays(calendarDayToDate(prevDate), 1)))
  }, [])

  const goToNextDay = useCallback(() => {
    setCurrentDate((prevDate) => dateToCalendarDay(addDays(calendarDayToDate(prevDate), 1)))
  }, [])

  const dateObject = calendarDayToDate(currentDate)

  const getDateLabel = (date: Date) => {
    if (isYesterday(date)) return "Yesterday"
    if (isToday(date)) return "Today"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "dd MMM yyyy")
  }

  const handleSelectDate = (date: Date | undefined) => {
    if (date) {
      setCurrentDate(dateToCalendarDay(date))
      setIsCalendarOpen(false)
    }
  }

  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPreviousDay}
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[150px] justify-center text-left font-normal"
          >
            <span className="text-lg font-semibold">
              {getDateLabel(dateObject)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={dateObject}
            onSelect={handleSelectDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="outline"
        size="icon"
        onClick={goToNextDay}
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}