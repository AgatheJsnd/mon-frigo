import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { Modal, EmptyState } from '../components/UI'
import { formatExpiry } from '../utils/helpers'
import { RECIPE_PHOTOS } from '../utils/recipePhotos'

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getRecipeById, ingredientStatus, confirmCook, setSelectedRecipeId } = useFridge()
  const [showConfirm, setShowConfirm] = useState(false)

  const recipe = id ? getRecipeById(id) : undefined

  if (!recipe) {
    return (
      <EmptyState
        title="Introuvable"
        message="Cette suggestion n’existe pas ou n’est plus disponible."
        action={
          <Link to="/recettes" className="btn btn--primary">
            Retour aux suggestions
          </Link>
        }
      />
    )
  }

  const status = ingredientStatus(recipe)

  function handleConfirm() {
    confirmCook(recipe!)
    setSelectedRecipeId(recipe!.id)
    setShowConfirm(false)
    navigate('/bon-appetit')
  }

  return (
    <div>
      <Link to="/recettes" className="back-link">
        ← Retour aux suggestions
      </Link>

      <div className="detail-layout">
        <div className="detail-photo">
          {RECIPE_PHOTOS[recipe.id] ? (
            <img src={RECIPE_PHOTOS[recipe.id]} alt="" className="detail-photo__img" />
          ) : (
            <span>Photo de la préparation</span>
          )}
        </div>

        <div>
          <h1 className="page-title">{recipe.title}</h1>
          <p className="page-sub">
            {recipe.timeMin} min · {recipe.servings} personne
            {recipe.servings > 1 ? 's' : ''} · {status.fridgeCount} aliment
            {status.fridgeCount > 1 ? 's' : ''} de votre frigo
          </p>

          <h2 className="section-title">Ingrédients</h2>
          <ul className="ing-list">
            {status.inFridge.map(({ ingredient, food }) => (
              <li key={ingredient.name} className="ing-in">
                ✓ {ingredient.quantity} {ingredient.name.toLowerCase()} · dans votre frigo
                {food && food.expiresInDays <= 3
                  ? ` (${formatExpiry(food.expiresInDays)})`
                  : ''}
              </li>
            ))}
            {status.toBuy.map((ingredient) => (
              <li key={ingredient.name} className="ing-out">
                + {ingredient.quantity} {ingredient.name.toLowerCase()} · à acheter
              </li>
            ))}
          </ul>

          <h2 className="section-title">Étapes</h2>
          <ol className="step-list">
            {recipe.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <div className="btn-row">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setShowConfirm(true)}
            >
              J’ai fini de cuisiner
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <Modal
          centered
          title="Retirer les aliments utilisés de votre frigo ?"
          icon={<FridgeLeafIcon />}
          onClose={() => setShowConfirm(false)}
        >
          <p>
            {status.fridgeCount} aliment{status.fridgeCount > 1 ? 's' : ''} de votre inventaire
            {status.fridgeCount > 1 ? ' seront retirés' : ' sera retiré'} si vous confirmez.
          </p>
          <div className="modal__actions">
            <button type="button" className="btn btn--primary" onClick={handleConfirm}>
              Confirmer
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setShowConfirm(false)}
            >
              Annuler
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function FridgeLeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="6"
        y="3"
        width="10"
        height="17"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M6 10h10M10 6.5v1.5M10 13v2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M17.2 14.2c1.8-.3 3-.9 3.8-2.2-.1 2.2-1.4 4.2-3.8 4.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.2 16.8V12.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
