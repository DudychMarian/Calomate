import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { MacrosBarsProps } from './MacrosBars';
import { CalorieChartProps } from './CalorieChart';

type ConsumptionTableProps = {
  calories: CalorieChartProps
  macros: MacrosBarsProps
}

export function ConsumptionTable({ calories, macros }: ConsumptionTableProps) {
  const macrosGoal = {
    protein: 150,
    fat: 67,
    carbs: 200,
  }// TODO - to be calculated based on user's goals

  const caloriesLeft = calories.limit - calories.current;
  const proteinLeft = macrosGoal.protein - macros.protein
  const fatLeft = macrosGoal.fat - macros.fat
  const carbsLeft = macrosGoal.carbs - macros.carbs

  return (
    <div className="border rounded-lg p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell></TableCell>
            <TableHead>Total</TableHead>
            <TableHead>KCAL</TableHead>
            <TableHead>Prot</TableHead>
            <TableHead>Fat</TableHead>
            <TableHead>Carbs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Goal</TableCell>
            <TableCell>{calories.limit}</TableCell>
            <TableCell>{macrosGoal.protein}</TableCell>
            <TableCell>{macrosGoal.fat}</TableCell>
            <TableCell>{macrosGoal.carbs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-bold'>-</TableCell>
            <TableCell>FOOD</TableCell>
            <TableCell>{calories.current}</TableCell>
            <TableCell>{macros.protein}</TableCell>
            <TableCell>{macros.fat}</TableCell>
            <TableCell>{macros.carbs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-bold'>+</TableCell>
            <TableCell>EXERCISE</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
            <TableCell>0</TableCell>
          </TableRow>
          <TableRow className="font-bold">
            <TableCell></TableCell>
            <TableCell>LEFT</TableCell>
            <TableCell className={`${caloriesLeft < 0 && "text-red-600"}`}>{caloriesLeft}</TableCell>
            <TableCell className={`${proteinLeft < 0 && "text-red-600"}`}>{proteinLeft}</TableCell>
            <TableCell className={`${fatLeft < 0 && "text-red-600"}`}>{fatLeft}</TableCell>
            <TableCell className={`${carbsLeft < 0 && "text-red-600"}`}>{carbsLeft}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}