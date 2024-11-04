import { useEffect } from 'react';
import { Plus, Trash2, Coffee, UtensilsCrossed, Soup, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

export type MealListProps = {
  onUpdate: (calories: number, macros: { protein: number; fat: number; carbs: number }) => void;
  onAddFood: (mealIndex: number) => void;
  meals: any[];
  setMeals: React.Dispatch<React.SetStateAction<any[]>>;
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
    try {
      const response = await fetch('/api/consumedFood', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItemId: itemToRemove.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMeals(prevMeals =>
          prevMeals.map((meal, idx) =>
            idx === mealIndex
              ? {
                ...meal,
                items: meal.items.filter((item: any) => item.id !== itemToRemove.id),
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

  const calculateMealTotals = (items: any[]) => {
    return items.reduce((totals, item) => ({
      calories: totals.calories + item.calories,
      protein: totals.protein + item.protein,
      fat: totals.fat + item.fat,
      carbs: totals.carbs + item.carbs,
    }), { calories: 0, protein: 0, fat: 0, carbs: 0 });
  };

  return (
    <div className="space-y-6">
      {meals.map((meal, mealIndex) => (
        <motion.div
          key={meal.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: mealIndex * 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {meal.icon && <meal.icon className="w-6 h-6" />}
                {meal.name}
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onAddFood(mealIndex)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {meal.items.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Food</TableHead>
                        <TableHead className="text-right">C</TableHead>
                        <TableHead className="text-right text-blue-500">P</TableHead>
                        <TableHead className="text-right text-yellow-500">F</TableHead>
                        <TableHead className="text-right text-green-500">C</TableHead>
                        <TableHead className="text-right"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {meal.items.map((item: any, itemIndex: number) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.calories.toFixed(0)}</TableCell>
                          <TableCell className="text-right text-blue-500">{item.protein.toFixed(1)}</TableCell>
                          <TableCell className="text-right text-yellow-500">{item.fat.toFixed(1)}</TableCell>
                          <TableCell className="text-right text-green-500">{item.carbs.toFixed(1)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(mealIndex, itemIndex)}
                              className="hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="font-semibold">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right">{calculateMealTotals(meal.items).calories.toFixed(0)}</TableCell>
                        <TableCell className="text-right text-blue-500">{calculateMealTotals(meal.items).protein.toFixed(1)}</TableCell>
                        <TableCell className="text-right text-yellow-500">{calculateMealTotals(meal.items).fat.toFixed(1)}</TableCell>
                        <TableCell className="text-right text-green-500">{calculateMealTotals(meal.items).carbs.toFixed(1)}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No items added yet.</p>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
