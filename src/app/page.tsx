"use client";

import { motion, AnimatePresence } from "framer-motion"
import { useDate } from '@/context/DateContext';

import { CalorieChart } from '@/components/CalorieChart';
import { MacrosBars } from '@/components/MacrosBars';
import { ConsumptionTable } from '@/components/ConsumptionTable';

export default function Home() {
  const { currentDate } = useDate();

  const calories = {
    limit: 2000,
    current: 1000
  } // TODO: get from API

  const macros = {
    protein: 100,
    fat: 100,
    carbs: 100
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentDate.join('-')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row gap-8"
      >
        <div className="md:w-1/2 space-y-8">
              <div className="border rounded-lg p-6 space-y-8">
                <CalorieChart limit={calories.limit} current={calories.current} />
                <MacrosBars {...macros} />
              </div>
              <ConsumptionTable calories={calories} macros={macros} />
            </div>
            <div className="md:w-1/2">
              {/* <MealList date={dateObject} onUpdate={handleMealUpdate} onAddFood={handleAddFood} /> */}
            </div>
      </motion.div>
    </AnimatePresence>
  );
}
