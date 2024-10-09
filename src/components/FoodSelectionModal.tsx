import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Barcode, ChevronLeft, ChevronDown, Edit, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FoodItem } from '@/types/food'
import { searchFoods } from '@/app/api/food/food'
import { calculateNutritionForServing, getAdditiveColor, getEcoScoreColor, getNovaGroupColor, getNutritionGradeColor, parseServingSize } from '@/lib/nutritionUtils'

type FoodSelectionModalProps = {
  isOpen: boolean
  onClose: () => void
  onSelectFood: (food: FoodItem, servingSize: number) => void
}

export function FoodSelectionModal({ isOpen, onClose, onSelectFood }: FoodSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null)
  const [servingSize, setServingSize] = useState<number>(100)
  const [customWeight, setCustomWeight] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [editedNutrition, setEditedNutrition] = useState<Partial<FoodItem>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchFoodData = async () => {
    if (searchTerm.trim() === '') {
      setFoods([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { foods, totalPages } = await searchFoods(searchTerm, currentPage)
      setFoods(foods)
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Error fetching food data:', error)
      setError('Failed to fetch food data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchFoodData()
  }

  const handleFoodClick = (food: FoodItem) => {
    setSelectedFood(food)
    setServingSize(parseServingSize(food.serving_size))
    setEditedNutrition({})
    setEditMode(false)
  }

  const handleServingSizeChange = (value: string) => {
    if (value === 'custom') {
      setCustomWeight(servingSize)
    } else {
      setServingSize(parseFloat(value))
      setCustomWeight(null)
    }
  }

  const handleCustomWeightChange = (value: number) => {
    setCustomWeight(value)
    setServingSize(value)
  }

  const handleEditNutrition = () => {
    setEditMode(true)
    setEditedNutrition(selectedFood || {})
  }

  const handleNutritionChange = (key: keyof FoodItem, value: number) => {
    setEditedNutrition(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveNutrition = () => {
    if (selectedFood) {
      setSelectedFood({ ...selectedFood, ...editedNutrition })
      setEditMode(false)
    }
  }

  const renderFoodSelection = () => (
    <div className="grid gap-4 py-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a food item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="pl-8"
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
        <Button variant="outline" size="icon">
          <Barcode className="h-4 w-4" />
        </Button>
      </div>
      {loading && <p>Searching for food items...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence>
            {foods.map((food) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="border rounded-lg p-2 cursor-pointer hover:bg-accent"
                onClick={() => handleFoodClick(food)}
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-24 object-contain rounded-md mb-2"
                />
                <p className="text-sm font-medium text-center">{food.name}</p>
                <p className="text-xs text-center text-muted-foreground">
                  {food.energy_100g ? `${food.energy_100g} kcal/100g` : 'No calorie info'}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => {
            setCurrentPage(prev => Math.max(prev - 1, 1))
            fetchFoodData()
          }}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          onClick={() => {
            setCurrentPage(prev => Math.min(prev + 1, totalPages))
            fetchFoodData()
          }}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )

  const renderFoodDetail = () => (
    <ScrollArea className="h-[600px] pr-4">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" onClick={() => setSelectedFood(null)} className="self-start">
          <ChevronLeft className="mr-2 h-4 w-4" /> Back to selection
        </Button>

        <div className="flex items-center gap-4">
          <img src={selectedFood?.image} alt={selectedFood?.name} className="w-24 h-24 object-contain rounded-md" />
          <div>
            <h3 className="text-lg font-semibold">{selectedFood?.name}</h3>
            <p className="text-sm text-muted-foreground">Energy: {calculateNutritionForServing(selectedFood?.energy_100g || 0, servingSize).toFixed(0)} kcal/{servingSize}g</p>
            {selectedFood?.nutrition_grade && selectedFood.nutrition_grade.length > 0 && (
              <Badge className={`${getNutritionGradeColor(selectedFood.nutrition_grade[0])} text-white`}>
                Nutrition Grade: {selectedFood.nutrition_grade[0].toUpperCase()}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Select onValueChange={handleServingSizeChange} defaultValue={servingSize.toString()}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select serving size" />
            </SelectTrigger>
            <SelectContent>
              {servingSize.toString() !== '100' && <SelectItem value="100">100g</SelectItem>}
              {selectedFood?.serving_size && (
                <SelectItem value={parseServingSize(selectedFood.serving_size).toString()}>
                  {selectedFood.serving_size}
                </SelectItem>
              )}
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {customWeight !== null && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={customWeight}
                onChange={(e) => handleCustomWeightChange(parseInt(e.target.value))}
                className="w-20"
              />
              <span>g</span>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-md font-semibold">Nutrition Facts (per {servingSize}g)</h4>
            {!editMode && (
              <Button variant="outline" size="sm" onClick={handleEditNutrition}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutrient</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(['energy_100g',
                'protein_100g',
                'fat_100g',
                'carbs_100g',
                'fiber_100g',
                'sugars_100g',
                'salt_100g'] as const).map((nutrient) => (
                  <TableRow key={nutrient}>
                    <TableCell>{nutrient.replace('_100g', '').charAt(0).toUpperCase() + nutrient.replace('_100g', '').slice(1)}</TableCell>
                    <TableCell className="text-right">
                      {editMode ? (
                        <Input
                          type="number"
                          value={editedNutrition[nutrient] || selectedFood?.[nutrient] || 0}
                          onChange={(e) => handleNutritionChange(nutrient, parseFloat(e.target.value))}
                          className="w-20 text-right"
                        />
                      ) : (
                        `${calculateNutritionForServing(selectedFood?.[nutrient] || 0, servingSize).toFixed(1)}${nutrient === 'energy_100g' ? 'kcal' : 'g'}`
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {editMode && (
            <Button onClick={handleSaveNutrition} className="mt-4">Save Changes</Button>
          )}
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ingredients">
            <AccordionTrigger>View Ingredients</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm">{selectedFood?.ingredients || 'No ingredient information available.'}</p>
            </AccordionContent>
          </AccordionItem>
          {(selectedFood?.vitamins && Object.values(selectedFood.vitamins).some(v => v > 0)) ||
            (selectedFood?.minerals && Object.values(selectedFood.minerals).some(v => v > 0)) ? (
            <AccordionItem value="vitamins">
              <AccordionTrigger>Vitamins & Minerals</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nutrient</TableHead>
                      <TableHead className="text-right">Amount (per {servingSize}g)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries({ ...selectedFood?.vitamins, ...selectedFood?.minerals })
                      .filter(([_, value]) => value > 0)
                      .map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell>{key.replace('_', ' ').charAt(0).toUpperCase() + key.slice(1)}</TableCell>
                          <TableCell className="text-right">{calculateNutritionForServing(value, servingSize).toFixed(2)}g</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          ) : null}
        </Accordion>

        {selectedFood?.additives && selectedFood.additives.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2">Additives</h4>
            <div className="flex flex-wrap gap-2">
              {selectedFood.additives.map((additive, index) => {
                const cleanAdditive = additive.replace(/^en:/, '')
                return (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge
                          variant="outline"
                          className={`${getAdditiveColor(additive)} text-white cursor-help`}
                        >
                          {cleanAdditive}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Additive details for {cleanAdditive}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              })}
            </div>
          </div>
        )}

        {selectedFood?.nova_group && (
          <div>
            <h4 className="text-md font-semibold mb-2">NOVA Group</h4>
            <Badge className={`${getNovaGroupColor(selectedFood.nova_group)} text-white`}>
              Group {selectedFood.nova_group}
            </Badge>
            <p className="text-sm mt-1">
              {selectedFood.nova_group === 1 ? 'Unprocessed or minimally processed foods' :
                selectedFood.nova_group === 2 ? 'Processed culinary ingredients' :
                  selectedFood.nova_group === 3 ? 'Processed foods' :
                    'Ultra-processed food and drink products'}
            </p>
          </div>
        )}

        {selectedFood?.ecoscore_grade && (
          <div>
            <h4 className="text-md font-semibold mb-2">Eco-Score</h4>
            <Badge className={`${getEcoScoreColor(selectedFood.ecoscore_grade)} text-white`}>
              {selectedFood.ecoscore_grade.toUpperCase()}
            </Badge>
          </div>
        )}

        <Button onClick={() => onSelectFood({ ...selectedFood! }, servingSize)}>
          Add to Meal
        </Button>
      </div>
    </ScrollArea>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>{selectedFood ? 'Food Details' : 'Add Food'}</DialogTitle>
        </DialogHeader>
        {selectedFood ? renderFoodDetail() : renderFoodSelection()}
      </DialogContent>
    </Dialog>
  )
}