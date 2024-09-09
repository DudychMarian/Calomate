"use client";

import { CalendarDay, dateToCalendarDay } from '@/lib/calendar';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DateContextProps {
  currentDate: CalendarDay;
  setCurrentDate: (date: any) => void;
}

const DateContext = createContext<DateContextProps | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDate] = useState<CalendarDay>(dateToCalendarDay(new Date()))


  return (
    <DateContext.Provider value={{ currentDate, setCurrentDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error('useDate must be used within a DateProvider');
  }
  return context;
};
