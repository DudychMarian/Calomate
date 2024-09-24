"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Cookie, Loader2, Soup, UtensilsCrossed } from 'lucide-react';

import { useDate } from '@/context/DateContext';
import { useUser } from '@/context/UserContext';

import { CalorieChart } from '@/components/CalorieChart';
import { MacrosBars } from '@/components/MacrosBars';
import { ConsumptionTable } from '@/components/ConsumptionTable';
import { MealList } from '@/components/MealList';
import { FoodSelectionModal } from '@/components/FoodSelectionModal';
import WaterTracker from '@/components/WaterTracker';
import { calendarDayToDate } from '@/lib/calendar';

const MEAL_TYPES = [
  { id: 0, name: 'Breakfast', icon: Coffee },
  { id: 1, name: 'Lunch', icon: UtensilsCrossed },
  { id: 2, name: 'Dinner', icon: Soup },
  { id: 3, name: 'Snack', icon: Cookie },
];
export default function Home() {
  const [calories, setCalories] = useState<{ limit: number; current: number } | null>(null);
  const [targetMacros, setTargetMacros] = useState<{ protein: number; fat: number; carbs: number } | null>(null);
  const [macros, setMacros] = useState<{ protein: number; fat: number; carbs: number } | null>(null);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [currentMealIndex, setCurrentMealIndex] = useState(0);
  const [meals, setMeals] = useState(MEAL_TYPES.map(type => ({ ...type, items: [] })));

  const { currentDate } = useDate();
  const { user } = useUser();

  const dateObject = calendarDayToDate(currentDate);

  const fetchMeals = async () => {
    if (user && dateObject) {
      try {
        const response = await fetch(`/api/consumedFood?userId=${user.id}&date=${dateObject.toISOString()}`);
        const data = await response.json();

        if (data.success) {
          if (data.consumedFood) {
            const updatedMeals = MEAL_TYPES.map(mealType => {
              const category = data.consumedFood.foodItems.filter((item: any) => item.category === mealType.id);
              return {
                ...mealType,
                items: category,
              };
            });
            setMeals(updatedMeals);
          } else {
            setMeals(MEAL_TYPES.map(type => ({ ...type, items: [] })));
          }
        }
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    }
  };

  useEffect(() => {
    fetchMeals()
  }, [user, currentDate]);

  useEffect(() => {
    if (user && user.nutritions) {
      const { calorieNeeds, macrosDistribution } = user.nutritions;

      setCalories({ limit: calorieNeeds, current: 0 });
      setTargetMacros({
        protein: macrosDistribution.protein,
        fat: macrosDistribution.fat,
        carbs: macrosDistribution.carbs,
      });
      setMacros({ protein: 0, fat: 0, carbs: 0 });
    }
  }, [user]);

  const handleMealUpdate = (newCalories: number, newMacros: typeof macros) => {
    setCalories((prev) => prev ? { ...prev, current: newCalories } : null);
    setMacros(newMacros);
  };

  const handleAddFood = (mealIndex: number) => {
    setCurrentMealIndex(mealIndex);
    setIsFoodModalOpen(true);
  };

  const addFoodToDatabase = async ({ foodData, currentMealIndex }: { foodData: any[], currentMealIndex: number }) => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch('/api/consumedFood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          date: new Date(currentDate.join("-")),
          foodItems: foodData.map(item => ({
            ...item,
            category: currentMealIndex, // Assign the category based on currentMealIndex
          })),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        console.error("Failed to add food", result.message);
      } else {
        console.log("Food added successfully", result.consumedFood);
        // Optionally, refresh the data or trigger updates
        fetchMeals();
      }
    } catch (error) {
      console.error("Error adding food to database", error);
    }
  };

  if (!calories || !macros || !targetMacros) {
    return <Loader2 className="h-6 w-6 animate-spin" />
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.join("-")}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row gap-8"
        >
          <div className="md:w-1/2 space-y-8">
            <div className="border rounded-lg p-6 space-y-8">
              <CalorieChart limit={calories.limit} current={calories.current} />
              <MacrosBars target={targetMacros} {...macros} />
            </div>
            <ConsumptionTable calories={calories} macros={{ ...macros, target: targetMacros }} />
            <WaterTracker showTitle={true} showProgress={true} showGlassCount={true} />
          </div>
          <div className="md:w-1/2">
            {<MealList onUpdate={handleMealUpdate} onAddFood={handleAddFood} meals={meals} setMeals={setMeals} />}
          </div>
        </motion.div>
      </AnimatePresence>
      <FoodSelectionModal
        isOpen={isFoodModalOpen}
        onClose={() => setIsFoodModalOpen(false)}
        onSelectFood={(food) => {
          console.log("Adding food to meal", currentMealIndex, food);
          addFoodToDatabase({ foodData: [food], currentMealIndex });
          setIsFoodModalOpen(false);
        }}
      />
    </>
  );
}
