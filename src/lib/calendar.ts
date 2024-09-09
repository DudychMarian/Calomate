export type CalendarDay = [year: number, month: number, day: number]

export const dateToCalendarDay = (date: Date): CalendarDay => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()
]

export const calendarDayToDate = ([year, month, day]: CalendarDay): Date =>
  new Date(year, month - 1, day)