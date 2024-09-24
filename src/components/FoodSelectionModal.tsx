import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Barcode } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const RECOMMENDED_FOODS = [
  { id: 'id-1', name: 'Apple', image: "	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100", calories: 95, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-2', name: 'Banana', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 105, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-3', name: 'Chicken Breast', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 165, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-4', name: 'Salmon', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 206, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-5', name: 'Broccoli', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 55, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-6', name: 'Brown Rice', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 216, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-7', name: 'Egg', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 68, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-8', name: 'Greek Yogurt', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 59, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-9', name: 'Almonds', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 164, protein: 1, fat: 2, carbs: 3 },
  { id: 'id-10', name: 'Avocado', image: '	https://g-xidhbonxjos.vusercontent.net/placeholder.svg?height=100&width=100', calories: 320, protein: 1, fat: 2, carbs: 3 },
]

type FoodSelectionModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectFood: (food: { id: string; name: string; calories: number; protein: number; fat: number; carbs: number }) => void
}

export function FoodSelectionModal({ isOpen, onClose, onSelectFood }: FoodSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredFoods = RECOMMENDED_FOODS.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Add Food</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" size="icon">
              <Barcode className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <AnimatePresence>
              {filteredFoods.map((food) => (
                <motion.div
                  key={food.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="border rounded-lg p-2 cursor-pointer hover:bg-accent"
                  onClick={() => onSelectFood(food)}
                >
                  <img src={food.image} alt={food.name} className="w-full h-24 object-cover rounded-md mb-2" />
                  <p className="text-sm font-medium text-center">{food.name}</p>
                  <p className="text-xs text-center text-muted-foreground">{food.calories} kcal</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}