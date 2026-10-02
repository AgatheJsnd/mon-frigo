export type FoodItem = {
  id: string
  name: string
  quantity: string
  expiresInDays: number
}

export type RecipeIngredient = {
  name: string
  quantity: string
  foodId?: string
  optional?: boolean
}

export type Recipe = {
  id: string
  title: string
  timeMin: number
  servings: number
  vegetarian: boolean
  ingredients: RecipeIngredient[]
  steps: string[]
  highlight?: string
}

export type ScanStatus = 'idle' | 'loading' | 'success' | 'error' | 'empty'

export type TimeFilter = 'any' | '15' | '30'
export type RecipeFilters = {
  urgentOnly: boolean
  maxTime: TimeFilter
  vegetarian: boolean
}

export type CookResult = {
  recipeId: string
  recipeTitle: string
  removedCount: number
  remainingCount: number
}
