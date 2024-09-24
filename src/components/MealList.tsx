import { useState, useEffect } from 'react';
import { Plus, Trash2, Coffee, UtensilsCrossed, Soup, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export type MealListProps = {
  onUpdate: (calories: number, macros: { protein: number; fat: number; carbs: number }) => void;
  onAddFood: (mealIndex: number) => void;
  meals: any[];
  setMeals: (meals: any[]) => void;
};

export function MealList({ onUpdate, onAddFood, meals, setMeals }: MealListProps) {

  useEffect(() => {
    const totalCalories = meals.reduce((sum, meal) =>
      sum + meal.items.reduce((mealSum: number, item: any) => mealSum + item.calories, 0), 0);
    const totalProtein = meals.reduce((sum, meal) =>
      sum + meal.items.reduce((mealSum: number, item: any) => mealSum + item.protein, 0), 0);
    const totalFat = meals.reduce((sum, meal) =>
      sum + meal.items.reduce((mealSum: number, item: any) => mealSum + item.fat, 0), 0);
    const totalCarbs = meals.reduce((sum, meal) =>
      sum + meal.items.reduce((mealSum: number, item: any) => mealSum + item.carbs, 0), 0);

    onUpdate(totalCalories, { protein: totalProtein, fat: totalFat, carbs: totalCarbs });
  }, [meals]);

  const removeItem = async (mealIndex: number, itemIndex: number) => {
    const itemToRemove = meals[mealIndex].items[itemIndex];

    // Call API to delete food item by id
    try {
      const response = await fetch('/api/consumedFood', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItemId: itemToRemove.id, // Send the foodItemId to be deleted
        }),
      });

      const data = await response.json();

      if (response.ok) {
        //@ts-ignore
        setMeals(prevMeals =>
          //@ts-ignore
          prevMeals.map((meal, idx ) =>
            idx === mealIndex
              ? {
                ...meal,
                items: meal.items.filter((item: any) => item.id !== itemToRemove.id), // Use UUIDs for filtering
              }
              : meal
          )
        );

      } else {
        console.error("Failed to delete food item:", data.error);
      }
    } catch (error) {
      console.error("Error deleting food item", error);
    }
  };

  return (
    <div className="space-y-6">
      {meals.map((meal, mealIndex) => (
        <motion.div
          key={meal.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: mealIndex * 0.1 }}
          className="border rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <meal.icon className="w-6 h-6" />
              <h2 className="text-lg font-semibold">{meal.name}</h2>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => { onAddFood(mealIndex) }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
          <AnimatePresence>
            {meal.items.map((item: any, itemIndex: number) => (
              <motion.div
                key={item.id} // Use item.id for unique keys
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between py-2">
                  <span>{item.name} - {item.calories} kcal</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeItem(mealIndex, itemIndex)}
                    className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
