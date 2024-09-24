"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { PlusCircle, Edit, Trash2, X } from 'lucide-react'

type Recipe = {
  id: string
  title: string
  description: string
  image: string | null
  ingredients: string[]
  steps: string[]
  status: 'Draft' | 'Published'
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes')
      if (!response.ok) throw new Error('Failed to fetch recipes')
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      toast.error("Failed to fetch recipes. Please try again.")
    }
  }

  const handleCreateOrUpdateRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const url = currentRecipe ? `/api/recipes/${currentRecipe.id}` : '/api/recipes'
      const method = currentRecipe ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recipe),
      })
      if (!response.ok) throw new Error('Failed to save recipe')
      setIsModalOpen(false)
      fetchRecipes()
      toast.success(`Recipe ${currentRecipe ? 'updated' : 'created'} successfully.`)
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast.error(`Failed to ${currentRecipe ? 'update' : 'create'} recipe. Please try again.`)
    }
  }

  const handleDeleteRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete recipe')
      fetchRecipes()
      toast.success("Recipe deleted successfully.")
    } catch (error) {
      console.error('Error deleting recipe:', error)
      toast.error("Failed to delete recipe. Please try again.")
    }
  }

  const handlePublishRecipe = async (id: string) => {
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Published' }),
      })
      if (!response.ok) throw new Error('Failed to publish recipe')
      fetchRecipes()
      toast.success("Recipe published successfully.")
    } catch (error) {
      console.error('Error publishing recipe:', error)
      toast.error("Failed to publish recipe. Please try again.")
    }
  }

  const openCreateModal = () => {
    setCurrentRecipe(null)
    setIsModalOpen(true)
  }

  const openEditModal = (recipe: Recipe) => {
    setCurrentRecipe(recipe)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <Button onClick={openCreateModal}>
          <PlusCircle className="mr-2 h-4 w-4" /> Create New Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id}>
            <CardHeader>
              <CardTitle>{recipe.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{recipe.description}</p>
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="w-full h-48 object-cover rounded-md mb-2" />
              )}
              <p className="text-sm font-medium">Status: {recipe.status}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              {recipe.status === 'Draft' ? (
                <Button onClick={() => handlePublishRecipe(recipe.id)}>Publish</Button>
              ) : (
                <Button variant="secondary">View</Button>
              )}
              <div>
                <Button variant="outline" className="mr-2" onClick={() => openEditModal(recipe)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteRecipe(recipe.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className='bg-white'>
          <DialogHeader>
            <DialogTitle>{currentRecipe ? 'Edit Recipe' : 'Create New Recipe'}</DialogTitle>
          </DialogHeader>
          <RecipeForm
            recipe={currentRecipe}
            onSubmit={handleCreateOrUpdateRecipe}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

type RecipeFormProps = {
  recipe: Recipe | null
  onSubmit: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

function RecipeForm({ recipe, onSubmit, onCancel }: RecipeFormProps) {
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>>({
    title: recipe?.title || '',
    description: recipe?.description || '',
    image: recipe?.image || '',
    ingredients: recipe?.ingredients || [''],
    steps: recipe?.steps || [''],
    status: recipe?.status || 'Draft',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (index: number, value: string, field: 'ingredients' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }))
  }

  const handleAddItem = (field: 'ingredients' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }))
  }

  const handleRemoveItem = (index: number, field: 'ingredients' | 'steps') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label>Ingredients</Label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Input
              value={ingredient}
              onChange={(e) => handleArrayChange(index, e.target.value, 'ingredients')}
              placeholder={`Ingredient ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveItem(index, 'ingredients')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => handleAddItem('ingredients')}
          className="mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4 cursor-pointer" /> Add Ingredient
        </Button>
      </div>
      <div>
        <Label>Steps</Label>
        {formData.steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2 mt-2">
            <Textarea
              value={step}
              onChange={(e) => handleArrayChange(index, e.target.value, 'steps')}
              placeholder={`Step ${index + 1}`}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => handleRemoveItem(index, 'steps')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => handleAddItem('steps')}
          className="mt-2"
        >
          <PlusCircle className="mr-2 h-4 w-4 cursor-pointer" /> Add Step
        </Button>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {recipe ? 'Update Recipe' : 'Create Recipe'}
        </Button>
      </DialogFooter>
    </form>
  )
}