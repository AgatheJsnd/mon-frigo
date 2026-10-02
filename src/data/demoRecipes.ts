import type { Recipe } from '../types'

/** Recettes de démonstration — brancher une API recettes ici plus tard. */
export const DEMO_RECIPES: Recipe[] = [
  {
    id: 'r1',
    title: 'Poêlée de courgettes au poulet',
    timeMin: 25,
    servings: 2,
    vegetarian: false,
    ingredients: [
      { name: 'Courgettes', quantity: '2', foodId: 'f1' },
      { name: 'Blancs de poulet', quantity: '2', foodId: 'f4' },
      { name: 'Oignon', quantity: '1', foodId: 'f10' },
      { name: 'Citron', quantity: '1', foodId: 'f9' },
    ],
    steps: [
      'Coupez les courgettes et le poulet en dés.',
      'Faites dorer le poulet 8 min à feu vif.',
      'Ajoutez les courgettes et laissez cuire 10 min à feu moyen.',
    ],
    highlight: 'courgettes',
  },
  {
    id: 'r2',
    title: 'Omelette aux épinards et chèvre',
    timeMin: 15,
    servings: 2,
    vegetarian: true,
    ingredients: [
      { name: 'Œufs', quantity: '3', foodId: 'f6' },
      { name: 'Épinards', quantity: '1 sachet', foodId: 'f5' },
      { name: 'Crème fraîche', quantity: '2 c.s.', foodId: 'f2' },
      { name: 'Beurre', quantity: '1 noix', foodId: 'f8' },
      { name: 'Chèvre', quantity: '50 g' },
    ],
    steps: [
      'Lavez et égouttez les épinards.',
      'Battez les œufs avec la crème fraîche.',
      'Faites revenir les épinards au beurre, versez les œufs et ajoutez le chèvre.',
    ],
    highlight: 'crème fraîche',
  },
  {
    id: 'r3',
    title: 'Pâtes crémeuses aux courgettes',
    timeMin: 40,
    servings: 4,
    vegetarian: true,
    ingredients: [
      { name: 'Tomates', quantity: '4', foodId: 'f3' },
      { name: 'Courgettes', quantity: '1', foodId: 'f1' },
      { name: 'Oignon', quantity: '1', foodId: 'f10' },
      { name: 'Crème fraîche', quantity: '1 pot', foodId: 'f2' },
      { name: 'Lait', quantity: '20 cl', foodId: 'f7' },
      { name: 'Pâtes', quantity: '300 g' },
    ],
    steps: [
      'Préchauffez le four à 180 °C et cuisez les pâtes al dente.',
      'Faites revenir oignon, courgette et tomates 10 min.',
      'Mélangez avec crème et lait, enfournez 20 min.',
    ],
    highlight: 'tomates',
  },
  {
    id: 'r4',
    title: 'Salade de lentilles et feta',
    timeMin: 10,
    servings: 2,
    vegetarian: true,
    ingredients: [
      { name: 'Citron', quantity: '1', foodId: 'f9' },
      { name: 'Oignon', quantity: '½', foodId: 'f10' },
      { name: 'Yaourt', quantity: '2', foodId: 'f11' },
      { name: 'Lentilles cuites', quantity: '250 g', optional: true },
      { name: 'Feta', quantity: '80 g', optional: true },
    ],
    steps: [
      'Égouttez les lentilles et émincez l’oignon.',
      'Assaisonnez avec le jus de citron et un peu de yaourt.',
      'Émiettez la feta et servez frais.',
    ],
  },
]
