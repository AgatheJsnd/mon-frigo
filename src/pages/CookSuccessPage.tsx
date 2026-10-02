import { useRef } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { formatExpiry } from '../utils/helpers'
import { RECIPE_PHOTOS } from '../utils/recipePhotos'

export function CookSuccessPage() {
  const { cookResult, foods, urgentFoods, clearCookResult } = useFridge()
  const navigate = useNavigate()
  const leavingRef = useRef(false)

  function go(path: string) {
    leavingRef.current = true
    navigate(path)
    clearCookResult()
  }

  if (!cookResult) {
    if (leavingRef.current) return null
    return <Navigate to="/recettes" replace />
  }

  const nextUrgent = urgentFoods[0] ?? foods.find((f) => f.expiresInDays <= 5)
  const photo = RECIPE_PHOTOS[cookResult.recipeId]
  const tipName = cookResult.recipeTitle.toLowerCase()

  return (
    <div className="cook-success">
      <div className="cook-success__hero">
        {photo ? (
          <img src={photo} alt="" className="cook-success__hero-img" />
        ) : (
          <div className="cook-success__hero-fallback" aria-hidden />
        )}
        <svg className="cook-success__wave" viewBox="0 0 390 36" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0 22 C 55 6, 110 30, 170 16 S 280 4, 390 20 L390 36 L0 36 Z"
            fill="var(--bg)"
          />
        </svg>
        <span className="cook-success__spark cook-success__spark--tl" aria-hidden>
          <SparkIcon />
        </span>
        <span className="cook-success__spark cook-success__spark--tr" aria-hidden>
          <SparkIcon />
        </span>
      </div>

      <div className="cook-success__body">
        <div className="cook-success__intro">
          <div className="cook-success__check-wrap" aria-hidden>
            <span className="cook-success__spark cook-success__spark--left">
              <SparkIcon />
            </span>
            <span className="cook-success__check">
              <CheckIcon />
            </span>
            <span className="cook-success__spark cook-success__spark--right">
              <SparkIcon />
            </span>
          </div>

          <h1 className="cook-success__title">Bon appétit !</h1>

          <div className="cook-success__copy">
            <p className="cook-success__text">
              La recette « {cookResult.recipeTitle} » est lancée. Votre frigo est à jour :{' '}
              {cookResult.removedCount} aliment{cookResult.removedCount > 1 ? 's' : ''} retiré
              {cookResult.removedCount > 1 ? 's' : ''}.
            </p>
            <span className="cook-success__leaves" aria-hidden>
              <LeavesIcon />
            </span>
          </div>
        </div>

        <section className="cook-success__card card">
          <div className="cook-success__fridge-row">
            <span className="cook-success__fridge-icon" aria-hidden>
              <FridgeIcon />
            </span>
            <strong>
              {foods.length} aliment{foods.length !== 1 ? 's' : ''} dans votre frigo
            </strong>
          </div>
          {nextUrgent ? (
            <div className="cook-success__warn">
              <WarnIcon />
              <p>
                <strong>À utiliser bientôt :</strong> {nextUrgent.name.toLowerCase()} ·{' '}
                {formatExpiry(nextUrgent.expiresInDays)}
              </p>
            </div>
          ) : (
            <p className="cook-success__ok">Rien d’urgent pour le moment.</p>
          )}
        </section>

        <div className="cook-success__actions">
          <button type="button" className="btn btn--primary" onClick={() => go('/frigo')}>
            Voir mon frigo
            <ChevronIcon />
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => go('/')}>
            Retour à l’accueil
          </button>
        </div>

        <aside className="cook-success__tip">
          <span className="cook-success__tip-leaves" aria-hidden>
            <LeavesIcon />
          </span>
          <div>
            <strong>Bonne cuisine !</strong>
            <p>Profitez de votre {tipName}.</p>
          </div>
          <span className="cook-success__tip-spark" aria-hidden>
            <SparkIcon />
          </span>
        </aside>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12.5 10 17.5 19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v6M7.8 5.8 11 9M16.2 5.8 13 9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LeavesIcon() {
  return (
    <svg width="30" height="24" viewBox="0 0 30 24" fill="none" aria-hidden>
      <path
        d="M8.5 19c-3.4-1.3-5.3-4-5.3-7.5C3.2 7 5.8 4.8 9.6 4.8c4.5 0 6.9 3 6.9 6.9 0 2.3-1 4.2-2.8 5.3"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.6 19V10.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="M19.2 20c-3-1.1-4.6-3.4-4.6-6.5 0-3.7 2.2-5.6 5.5-5.6 4 0 6 2.6 6 6.1 0 2.1-0.95 3.7-2.4 4.6"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M20.1 20v-6.8" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
    </svg>
  )
}

function FridgeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 10h12M10 6v2M10 13v3" strokeLinecap="round" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 21.5 20H2.5L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M12 10v5M12 17.5v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
