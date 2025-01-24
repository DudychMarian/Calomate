"use client"

import { useState, useEffect } from 'react'
import { Plus, Minus, Coffee, Utensils, Salad, Cake, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Recipe, RecipeStatus } from '@prisma/client'
import { useUser } from '@/context/UserContext'
import Lottie from 'react-lottie'
import emptyStateAnimation from '@/animations/empty-state.json'

const categories = [
  { name: "Breakfast", icon: Coffee, color: "bg-yellow-500" },
  { name: "Lunch", icon: Utensils, color: "bg-green-500" },
  { name: "Dinner", icon: Utensils, color: "bg-blue-500" },
  { name: "Snacks", icon: Cake, color: "bg-purple-500" },
  { name: "Drinks", icon: Coffee, color: "bg-red-500" },
  { name: "Under 100 kcal", icon: Salad, color: "bg-teal-500" },
]

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    title: '',
    description: '',
    ingredients: [],
    steps: [],
    status: RecipeStatus.Draft
  })
  const { user } = useUser();
  const [servings, setServings] = useState(1)
  const [totalKcal, setTotalKcal] = useState(0)

  useEffect(() => {
    fetchRecipes()
  }, [user])

  useEffect(() => {
    if (selectedCategory) {
      setFilteredRecipes(recipes.filter(recipe => recipe.category === selectedCategory))
    } else {
      setFilteredRecipes(recipes)
    }
  }, [selectedCategory, recipes])

  const fetchRecipes = async () => {
    try {
      const response = user && await fetch('/api/recipes?userId=' + user.id)
      const data = await response?.json()
      setRecipes(data.recipes)
    } catch (error) {
      console.error('Error fetching recipes:', error)
    }
  }

  const handleCreateRecipe = async () => {
    try {
      const response = user && await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRecipe,
          servings,
          totalKcal,
          category: "Breakfast",
          userId: user.id,
        }),
      })
      const createdRecipe = await response?.json()
      setRecipes([...recipes, createdRecipe])
      setIsCreateDialogOpen(false)
      resetNewRecipe()
    } catch (error) {
      console.error('Error creating recipe:', error)
    }
  }

  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes?id=${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setRecipes(recipes.filter(recipe => recipe.id !== id))
        setIsViewDialogOpen(false)
      }
    } catch (error) {
      console.error('Error deleting recipe:', error)
    }
  }

  const resetNewRecipe = () => {
    setNewRecipe({
      title: '',
      description: '',
      ingredients: [],
      steps: [],
      status: RecipeStatus.Draft
    })
    setServings(1)
    setTotalKcal(0)
  }

  const handleAddIngredient = () => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: [...(prev.ingredients || []), '']
    }))
  }

  const handleIngredientChange = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients?.map((ingredient, i) => i === index ? value : ingredient) || []
    }))
  }

  const handleAddStep = () => {
    setNewRecipe(prev => ({
      ...prev,
      steps: [...(prev.steps || []), '']
    }))
  }

  const handleStepChange = (index: number, value: string) => {
    setNewRecipe(prev => ({
      ...prev,
      steps: prev.steps?.map((step, i) => i === index ? value : step) || []
    }))
  }

  const renderCreateRecipeForm = () => (
    <div className="space-y-4">
      <Input
        placeholder="Recipe name"
        value={newRecipe.title}
        onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
      />
      <Textarea
        placeholder="Recipe description"
        value={newRecipe.description}
        onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
      />
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span>Servings:</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(Math.max(1, servings - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span>{servings}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setServings(servings + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Input
          type="number"
          placeholder="Total kcal"
          value={totalKcal}
          onChange={(e) => setTotalKcal(parseInt(e.target.value))}
          className="w-24"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
        {newRecipe.ingredients?.map((ingredient, index) => (
          <div key={index} className="mb-2">
            <Input
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleAddIngredient}>
          <Plus className="h-4 w-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Steps</h3>
        {newRecipe.steps?.map((step, index) => (
          <div key={index} className="mb-2">
            <Textarea
              placeholder={`Step ${index + 1}`}
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
          </div>
        ))}
        <Button onClick={handleAddStep}>
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      </div>

      <Button onClick={handleCreateRecipe} disabled={!newRecipe.title || newRecipe.ingredients?.length === 0 || newRecipe.steps?.length === 0}>
        Save Recipe
      </Button>
    </div>
  )

  const renderViewRecipeDialog = () => (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>{selectedRecipe?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{selectedRecipe?.description}</p>
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside">
              {selectedRecipe?.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Steps</h3>
            <ol className="list-decimal list-inside">
              {selectedRecipe?.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
          <div className="flex justify-between items-center">
            <span>Servings: {selectedRecipe?.servings}</span>
            <span>Total kcal: {selectedRecipe?.totalKcal}</span>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => selectedRecipe && handleDeleteRecipe(selectedRecipe.id)}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Recipe
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <Lottie 
        options={{
          loop: true,
          autoplay: true, 
          animationData: emptyStateAnimation,
          rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
          }
        }}
        height={200}
        width={200}
      />
      <p className="mb-4">You haven't created any recipes yet.</p>
      <p className="mb-4">Why not create your first recipe?</p>
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogTrigger asChild>
          <Button>Create New Recipe</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Recipe</DialogTitle>
          </DialogHeader>
          {renderCreateRecipeForm()}
        </DialogContent>
      </Dialog>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Recipes</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {categories.map((category) => (
          <Card
            key={category.name}
            className={`cursor-pointer transition-all ${selectedCategory === category.name ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedCategory(prev => prev === category.name ? null : category.name)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <category.icon className={`h-8 w-8 ${category.color} text-white rounded p-1 mb-2`} />
              <span className="text-sm font-medium">{category.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {recipes && recipes.length === 0 ? (
        renderEmptyState()
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <AnimatePresence>
              {Array.isArray(filteredRecipes) && filteredRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="border p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
                  <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Servings: {recipe.servings}</span>
                    <span className="text-sm">Total kcal: {recipe.totalKcal}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                      <Badge key={index} variant="secondary">{ingredient}</Badge>
                    ))}
                    {recipe.ingredients.length > 3 && (
                      <Badge variant="secondary">+{recipe.ingredients.length - 3} more</Badge>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setSelectedRecipe(recipe)
                      setIsViewDialogOpen(true)
                    }}
                  >
                    View Recipe
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="fixed bottom-16 right-4 rounded-full shadow-lg md:bottom-4">
                <Plus className="h-6 w-6 mr-2" />
                Create New Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New Recipe</DialogTitle>
              </DialogHeader>
              {renderCreateRecipeForm()}
            </DialogContent>
          </Dialog>
          {renderViewRecipeDialog()}
        </div>
      )}
    </div>
  )
}