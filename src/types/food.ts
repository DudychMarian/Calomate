export type FoodItem = {
  id: string
  name: string
  image: string
  energy_100g: number
  protein_100g: number
  fat_100g: number
  carbs_100g: number
  fiber_100g: number
  sugars_100g: number
  salt_100g: number
  alcohol_100g: number
  ingredients: string
  additives: string[]
  nutrition_grade: string[]
  serving_size?: string
  vitamins?: { [key: string]: number }
  minerals?: { [key: string]: number }
  nova_group?: number
  ecoscore_grade?: string
}