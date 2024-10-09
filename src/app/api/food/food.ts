import { FoodItem } from '@/types/food'

const ITEMS_PER_PAGE = 10

export async function searchFoods(searchTerm: string, currentPage: number): Promise<{ foods: FoodItem[], totalPages: number }> {
  if (searchTerm.trim() === '') {
    return { foods: [], totalPages: 0 }
  }

  try {
    const searchTermFormatted = encodeURIComponent(searchTerm).replace(/%20/g, '+')
    const response = await fetch(
      `https://uk.openfoodfacts.org/cgi/search.pl?search_terms=${searchTermFormatted}&search_simple=1&action=process&json=1&page_size=${ITEMS_PER_PAGE}&page=${currentPage}`
    )
    const data = await response.json()

    if (!data.products || data.products.length === 0) {
      return { foods: [], totalPages: 0 }
    }

    const foods: FoodItem[] = data.products.map((product: any) => ({
      id: product.id || '',
      name: product.product_name || 'Unknown',
      image: product.image_front_url || 'https://via.placeholder.com/100',
      energy_100g: product.nutriments?.['energy-kcal_100g'] || 0,
      protein_100g: product.nutriments?.proteins_100g || 0,
      fat_100g: product.nutriments?.fat_100g || 0,
      carbs_100g: product.nutriments?.carbohydrates_100g || 0,
      fiber_100g: product.nutriments?.fiber_100g || 0,
      sugars_100g: product.nutriments?.sugars_100g || 0,
      salt_100g: product.nutriments?.salt_100g || 0,
      alcohol_100g: product.nutriments?.alcohol_100g || 0,
      ingredients: product.ingredients_text || '',
      additives: product.additives_tags || [],
      nutrition_grade: product.nutrition_grades_tags || [],
      serving_size: product.serving_size || '100g',
      vitamins: {
        vitamin_a: product.nutriments?.['vitamin-a_100g'] || 0,
        vitamin_c: product.nutriments?.['vitamin-c_100g'] || 0,
        vitamin_d: product.nutriments?.['vitamin-d_100g'] || 0,
        vitamin_e: product.nutriments?.['vitamin-e_100g'] || 0,
      },
      minerals: {
        calcium: product.nutriments?.calcium_100g || 0,
        iron: product.nutriments?.iron_100g || 0,
        magnesium: product.nutriments?.magnesium_100g || 0,
        zinc: product.nutriments?.zinc_100g || 0,
      },
      nova_group: product.nova_group,
      ecoscore_grade: product.ecoscore_grade,
    }))

    const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE)

    return { foods, totalPages }
  } catch (error) {
    console.error('Error fetching food data:', error)
    throw new Error('Failed to fetch food data. Please try again.')
  }
}