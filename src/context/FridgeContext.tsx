import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_SCANNED_FOODS, INITIAL_FRIDGE } from '../data/demoFoods'
import { DEMO_RECIPES } from '../data/demoRecipes'
import type {
  CookResult,
  FoodItem,
  Recipe,
  RecipeFilters,
  ScanStatus,
  TimeFilter,
} from '../types'
import { matchFoodName, uid } from '../utils/helpers'

/** Remplacer par l’appel API de reconnaissance d’image. */
function getDemoScanOutcome(): 'success' | 'error' | 'empty' {
  return 'success'
}

type FridgeContextValue = {
  foods: FoodItem[]
  favorites: string[]
  scanDraft: FoodItem[]
  scanStatus: ScanStatus
  lastScanAt: Date | null
  selectedRecipeId: string | null
  filters: RecipeFilters
  priorityIds: string[]
  cookResult: CookResult | null
  recipes: Recipe[]
  urgentFoods: FoodItem[]
  setFilters: (patch: Partial<RecipeFilters>) => void
  setSelectedRecipeId: (id: string | null) => void
  setPriorityIds: (ids: string[]) => void
  togglePriority: (id: string) => void
  toggleFavorite: (id: string) => void
  startScan: () => Promise<'success' | 'error' | 'empty'>
  resetScan: () => void
  updateScanItem: (id: string, patch: Partial<FoodItem>) => void
  removeScanItem: (id: string) => void
  addScanItem: (name: string, quantity?: string, expiresInDays?: number) => void
  validateScan: () => void
  updateFood: (id: string, patch: Partial<FoodItem>) => void
  removeFood: (id: string) => void
  addFood: (name: string, quantity?: string, expiresInDays?: number) => void
  filteredRecipes: Recipe[]
  confirmCook: (recipe: Recipe) => CookResult
  clearCookResult: () => void
  getRecipeById: (id: string) => Recipe | undefined
  ingredientStatus: (recipe: Recipe) => {
    inFridge: { ingredient: Recipe['ingredients'][0]; food?: FoodItem }[]
    toBuy: Recipe['ingredients']
    fridgeCount: number
  }
}

const FridgeContext = createContext<FridgeContextValue | null>(null)

const defaultFilters: RecipeFilters = {
  urgentOnly: false,
  maxTime: 'any',
  vegetarian: false,
}

export function FridgeProvider({ children }: { children: ReactNode }) {
  const [foods, setFoods] = useState<FoodItem[]>(INITIAL_FRIDGE)
  const [favorites, setFavorites] = useState<string[]>(['r1', 'r2', 'r3', 'r4'])
  const [scanDraft, setScanDraft] = useState<FoodItem[]>([])
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle')
  const [lastScanAt, setLastScanAt] = useState<Date | null>(new Date())
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>('r1')
  const [filters, setFiltersState] = useState<RecipeFilters>(defaultFilters)
  const [priorityIds, setPriorityIds] = useState<string[]>(['f1', 'f3'])
  const [cookResult, setCookResult] = useState<CookResult | null>(null)

  const urgentFoods = useMemo(
    () => [...foods].filter((f) => f.expiresInDays <= 3).sort((a, b) => a.expiresInDays - b.expiresInDays),
    [foods],
  )

  const setFilters = useCallback((patch: Partial<RecipeFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...patch }))
  }, [])

  const togglePriority = useCallback((id: string) => {
    setPriorityIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const startScan = useCallback(async (): Promise<'success' | 'error' | 'empty'> => {
    setScanStatus('loading')
    setScanDraft([])
    await new Promise((r) => setTimeout(r, 1400))

    // Démo : succès avec données mock.
    // Brancher ici un service de vision (upload photo → API).
    // Pour tester : faire retourner 'error' ou 'empty' depuis getDemoScanOutcome().
    const outcome = getDemoScanOutcome()

    if (outcome === 'error') {
      setScanStatus('error')
      return 'error'
    }
    if (outcome === 'empty') {
      setScanStatus('empty')
      setScanDraft([])
      return 'empty'
    }

    const draft = DEMO_SCANNED_FOODS.map((f) => ({ ...f, id: uid('scan') }))
    setScanDraft(draft)
    setScanStatus('success')
    setLastScanAt(new Date())
    setPriorityIds(draft.filter((f) => f.expiresInDays <= 3).map((f) => f.id))
    return 'success'
  }, [])

  const resetScan = useCallback(() => {
    setScanStatus('idle')
    setScanDraft([])
  }, [])

  const updateScanItem = useCallback((id: string, patch: Partial<FoodItem>) => {
    setScanDraft((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }, [])

  const removeScanItem = useCallback((id: string) => {
    setScanDraft((prev) => prev.filter((f) => f.id !== id))
  }, [])

  const addScanItem = useCallback((name: string, quantity = '1', expiresInDays = 5) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setScanDraft((prev) => [
      ...prev,
      { id: uid('scan'), name: trimmed, quantity, expiresInDays },
    ])
  }, [])

  const validateScan = useCallback(() => {
    const nextFoods = scanDraft.map((f) => ({ ...f, id: uid('food') }))
    setFoods(nextFoods)
    setPriorityIds(nextFoods.filter((f) => f.expiresInDays <= 3).map((f) => f.id))
    setLastScanAt(new Date())
    setScanStatus('idle')
    setScanDraft([])
  }, [scanDraft])

  const updateFood = useCallback((id: string, patch: Partial<FoodItem>) => {
    setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }, [])

  const removeFood = useCallback((id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id))
    setPriorityIds((prev) => prev.filter((x) => x !== id))
  }, [])

  const addFood = useCallback((name: string, quantity = '1', expiresInDays = 5) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setFoods((prev) => [
      ...prev,
      { id: uid('food'), name: trimmed, quantity, expiresInDays },
    ])
  }, [])

  const ingredientStatus = useCallback(
    (recipe: Recipe) => {
      const inFridge: { ingredient: Recipe['ingredients'][0]; food?: FoodItem }[] = []
      const toBuy: Recipe['ingredients'] = []
      for (const ing of recipe.ingredients) {
        const food = foods.find(
          (f) => (ing.foodId && f.id === ing.foodId) || matchFoodName(f.name, ing.name),
        )
        if (food) inFridge.push({ ingredient: ing, food })
        else toBuy.push(ing)
      }
      return { inFridge, toBuy, fridgeCount: inFridge.length }
    },
    [foods],
  )

  const filteredRecipes = useMemo(() => {
    const priorityNames = foods
      .filter((f) => priorityIds.includes(f.id))
      .map((f) => f.name)

    return DEMO_RECIPES.filter((recipe) => {
      if (filters.vegetarian && !recipe.vegetarian) return false
      if (filters.maxTime === '15' && recipe.timeMin > 15) return false
      if (filters.maxTime === '30' && recipe.timeMin > 30) return false
      if (filters.urgentOnly && priorityNames.length > 0) {
        const usesPriority = recipe.ingredients.some((ing) =>
          priorityNames.some((n) => matchFoodName(n, ing.name)),
        )
        if (!usesPriority) return false
      }
      const status = ingredientStatus(recipe)
      return status.fridgeCount >= 1
    })
  }, [filters, foods, priorityIds, ingredientStatus])

  const confirmCook = useCallback(
    (recipe: Recipe): CookResult => {
      const status = ingredientStatus(recipe)
      const idsToRemove = status.inFridge
        .map((x) => x.food?.id)
        .filter((id): id is string => Boolean(id))
      const removedCount = idsToRemove.length
      setFoods((prev) => {
        const next = prev.filter((f) => !idsToRemove.includes(f.id))
        const result: CookResult = {
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          removedCount,
          remainingCount: next.length,
        }
        setCookResult(result)
        return next
      })
      setPriorityIds((prev) => prev.filter((id) => !idsToRemove.includes(id)))
      return {
        recipeId: recipe.id,
        recipeTitle: recipe.title,
        removedCount,
        remainingCount: foods.length - removedCount,
      }
    },
    [foods.length, ingredientStatus],
  )

  const clearCookResult = useCallback(() => setCookResult(null), [])

  const getRecipeById = useCallback(
    (id: string) => DEMO_RECIPES.find((r) => r.id === id),
    [],
  )

  const value: FridgeContextValue = {
    foods,
    favorites: [...new Set(favorites)],
    scanDraft,
    scanStatus,
    lastScanAt,
    selectedRecipeId,
    filters,
    priorityIds,
    cookResult,
    recipes: DEMO_RECIPES,
    urgentFoods,
    setFilters,
    setSelectedRecipeId,
    setPriorityIds,
    togglePriority,
    toggleFavorite,
    startScan,
    resetScan,
    updateScanItem,
    removeScanItem,
    addScanItem,
    validateScan,
    updateFood,
    removeFood,
    addFood,
    filteredRecipes,
    confirmCook,
    clearCookResult,
    getRecipeById,
    ingredientStatus,
  }

  return <FridgeContext.Provider value={value}>{children}</FridgeContext.Provider>
}

export function useFridge() {
  const ctx = useContext(FridgeContext)
  if (!ctx) throw new Error('useFridge must be used within FridgeProvider')
  return ctx
}

export type { TimeFilter }
