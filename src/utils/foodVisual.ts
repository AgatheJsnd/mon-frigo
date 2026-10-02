import creme from '../assets/foods/creme.jpg'
import courgettes from '../assets/foods/courgettes.jpg'
import tomates from '../assets/foods/tomates.jpg'
import poulet from '../assets/foods/poulet.jpg'
import epinards from '../assets/foods/epinards.jpg'
import lait from '../assets/foods/lait.jpg'
import yaourt from '../assets/foods/yaourt.jpg'
import oeufs from '../assets/foods/oeufs.jpg'
import beurre from '../assets/foods/beurre.jpg'
import citron from '../assets/foods/citron.jpg'
import oignon from '../assets/foods/oignon.jpg'

export type FoodVisual = {
  emoji: string
  bg: string
  photo?: string
}

const FOOD_VISUAL: Record<string, FoodVisual> = {
  'crème fraîche': { emoji: '🥛', bg: '#f3efe6', photo: creme },
  courgettes: { emoji: '🥒', bg: '#e5f0e4', photo: courgettes },
  tomates: { emoji: '🍅', bg: '#fce8e4', photo: tomates },
  épinards: { emoji: '🥬', bg: '#e5f0e4', photo: epinards },
  'blancs de poulet': { emoji: '🍗', bg: '#f7ebe3', photo: poulet },
  œufs: { emoji: '🥚', bg: '#f7f3e8', photo: oeufs },
  lait: { emoji: '🥛', bg: '#f0f4f8', photo: lait },
  beurre: { emoji: '🧈', bg: '#faf3d9', photo: beurre },
  citron: { emoji: '🍋', bg: '#fbf6d9', photo: citron },
  oignon: { emoji: '🧅', bg: '#f5ebe3', photo: oignon },
  yaourt: { emoji: '🥣', bg: '#f0f4f8', photo: yaourt },
}

export function foodVisual(name: string): FoodVisual {
  const key = name.toLowerCase()
  return FOOD_VISUAL[key] ?? { emoji: '🥗', bg: '#eaf3ea' }
}
