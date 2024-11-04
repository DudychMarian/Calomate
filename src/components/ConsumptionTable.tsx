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


  const caloriesLeft = calories.limit - calories.current;
  const proteinLeft = macros.target.protein - macros.protein
  const fatLeft = macros.target.fat - macros.fat
  const carbsLeft = macros.target.carbs - macros.carbs

  return (
    <div className="border rounded-lg p-4 bg-white border-[#F4F5F6]">
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
            <TableCell>{macros.target.protein}</TableCell>
            <TableCell>{macros.target.fat}</TableCell>
            <TableCell>{macros.target.carbs}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className='font-bold'>-</TableCell>
            <TableCell>FOOD</TableCell>
            <TableCell>{calories.current.toFixed(0)}</TableCell>
            <TableCell>{macros.protein.toFixed(0)}</TableCell>
            <TableCell>{macros.fat.toFixed(0)}</TableCell>
            <TableCell>{macros.carbs.toFixed(0)}</TableCell>
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
            <TableCell className={`${caloriesLeft < 0 && "text-red-600"}`}>{caloriesLeft.toFixed(0)}</TableCell>
            <TableCell className={`${proteinLeft < 0 && "text-red-600"}`}>{proteinLeft.toFixed(0)}</TableCell>
            <TableCell className={`${fatLeft < 0 && "text-red-600"}`}>{fatLeft.toFixed(0)}</TableCell>
            <TableCell className={`${carbsLeft < 0 && "text-red-600"}`}>{carbsLeft.toFixed(0)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}