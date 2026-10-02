import type { FoodItem } from '../types'

/** Données de démonstration — remplacer par un service de reconnaissance d'image plus tard. */
export const DEMO_SCANNED_FOODS: FoodItem[] = [
  { id: 'f2', name: 'Crème fraîche', quantity: '1 pot', expiresInDays: 1 },
  { id: 'f1', name: 'Courgettes', quantity: '2', expiresInDays: 2 },
  { id: 'f3', name: 'Tomates', quantity: '4', expiresInDays: 3 },
  { id: 'f4', name: 'Blancs de poulet', quantity: '2', expiresInDays: 4 },
  { id: 'f5', name: 'Épinards', quantity: '1 sachet', expiresInDays: 5 },
  { id: 'f6', name: 'Œufs', quantity: '6', expiresInDays: 8 },
  { id: 'f7', name: 'Lait', quantity: '1 L', expiresInDays: 6 },
  { id: 'f8', name: 'Beurre', quantity: '1 plaquette', expiresInDays: 12 },
  { id: 'f9', name: 'Citron', quantity: '2', expiresInDays: 10 },
  { id: 'f10', name: 'Oignon', quantity: '3', expiresInDays: 14 },
  { id: 'f11', name: 'Yaourt', quantity: '4', expiresInDays: 7 },
]

export const INITIAL_FRIDGE: FoodItem[] = DEMO_SCANNED_FOODS.map((f) => ({ ...f }))
