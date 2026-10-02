import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { AuthBrand, AuthDecor, BackIcon, ChevronIcon } from '../components/AuthIcons'

const DIETS = [
  { id: 'tout', label: 'Je mange de tout', icon: '🍽️' },
  { id: 'vegetarien', label: 'Végétarien', icon: '🌿' },
  { id: 'vegetalien', label: 'Végétalien', icon: '🍃' },
  { id: 'pescetarien', label: 'Pescétarien', icon: '🐟' },
  { id: 'sans-porc', label: 'Sans porc', icon: '🐷' },
] as const

const ALLERGENS = [
  { id: 'gluten', label: 'Gluten', icon: '🌾' },
  { id: 'lactose', label: 'Lactose', icon: '🥛' },
  { id: 'arachides', label: 'Arachides', icon: '🥜' },
  { id: 'fruits-coque', label: 'Fruits à coque', icon: '🌰' },
  { id: 'oeufs', label: 'Œufs', icon: '🥚' },
  { id: 'crustaces', label: 'Crustacés', icon: '🦐' },
  { id: 'aucune', label: 'Aucune', icon: '⊘' },
] as const

export function PreferencesPage() {
  const { isAuthenticated, profile, setPreferences, login } = useAuth()
  const navigate = useNavigate()
  const [diet, setDiet] = useState<string | null>('vegetarien')
  const [allergies, setAllergies] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState('')
  const [showCustom, setShowCustom] = useState(false)

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!profile.email) {
    return <Navigate to="/inscription" replace />
  }

  function toggleAllergy(id: string) {
    if (id === 'aucune') {
      setAllergies(['aucune'])
      return
    }
    setAllergies((prev) => {
      const withoutNone = prev.filter((x) => x !== 'aucune')
      return withoutNone.includes(id)
        ? withoutNone.filter((x) => x !== id)
        : [...withoutNone, id]
    })
  }

  function finish(skip = false) {
    if (skip) {
      setPreferences(null, [])
    } else {
      const extras = customAllergy.trim() ? [customAllergy.trim()] : []
      const list = allergies.includes('aucune')
        ? []
        : [...allergies.filter((a) => a !== 'aucune'), ...extras]
      setPreferences(diet, list)
    }
    login()
    navigate('/', { replace: true })
  }

  function addCustomAllergy(e: React.FormEvent) {
    e.preventDefault()
    const value = customAllergy.trim()
    if (!value) return
    setAllergies((prev) => {
      const withoutNone = prev.filter((x) => x !== 'aucune')
      return withoutNone.includes(value) ? withoutNone : [...withoutNone, value]
    })
    setCustomAllergy('')
    setShowCustom(false)
  }

  return (
    <div className="login prefs">
      <AuthDecor />

      <div className="prefs__top">
        <button
          type="button"
          className="signup__back"
          aria-label="Retour"
          onClick={() => navigate('/inscription')}
        >
          <BackIcon />
        </button>
      </div>

      <AuthBrand />

      <header className="login__header prefs__header">
        <h1>Personnalisons vos recettes</h1>
        <p>Indiquez vos habitudes alimentaires et vos allergies pour recevoir des suggestions adaptées.</p>
      </header>

      <section className="prefs__card">
        <div className="prefs__card-head">
          <h2>Vos habitudes alimentaires</h2>
        </div>
        <div className="prefs__chips">
          {DIETS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`prefs__chip${diet === item.id ? ' is-active' : ''}`}
              onClick={() => setDiet(item.id)}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="prefs__card">
        <div className="prefs__card-head">
          <h2>Allergies et intolérances</h2>
        </div>
        <div className="prefs__chips">
          {ALLERGENS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`prefs__chip${allergies.includes(item.id) ? ' is-active' : ''}`}
              onClick={() => toggleAllergy(item.id)}
            >
              <span aria-hidden>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {!showCustom ? (
          <button type="button" className="prefs__add" onClick={() => setShowCustom(true)}>
            + Ajouter une autre allergie
          </button>
        ) : (
          <form className="prefs__custom" onSubmit={addCustomAllergy}>
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              placeholder="Ex. : soja"
              autoFocus
            />
            <button type="submit" className="btn btn--primary">
              Ajouter
            </button>
          </form>
        )}

        {allergies.filter((a) => !ALLERGENS.some((x) => x.id === a)).length > 0 && (
          <div className="prefs__custom-list">
            {allergies
              .filter((a) => !ALLERGENS.some((x) => x.id === a))
              .map((a) => (
                <button
                  key={a}
                  type="button"
                  className="prefs__chip is-active"
                  onClick={() => setAllergies((prev) => prev.filter((x) => x !== a))}
                >
                  {a} ×
                </button>
              ))}
          </div>
        )}
      </section>

      <div className="prefs__actions">
        <button type="button" className="btn btn--primary login__submit" onClick={() => finish(false)}>
          Continuer
          <ChevronIcon />
        </button>
        <button type="button" className="prefs__skip" onClick={() => finish(true)}>
          Passer pour le moment
        </button>
      </div>
    </div>
  )
}

export const DIET_LABELS: Record<string, string> = Object.fromEntries(
  DIETS.map((d) => [d.id, d.label]),
)

export const ALLERGEN_LABELS: Record<string, string> = Object.fromEntries(
  ALLERGENS.map((a) => [a.id, a.label]),
)
