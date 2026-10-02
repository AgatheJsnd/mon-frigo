import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFridge } from '../context/FridgeContext'
import { TitleWave } from '../components/TitleWave'
import { RECIPE_PHOTOS } from '../utils/recipePhotos'
import { ALLERGEN_LABELS, DIET_LABELS } from './PreferencesPage'

export function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const { foods, favorites, recipes, toggleFavorite } = useFridge()

  const displayName =
    [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
    profile.email.split('@')[0] ||
    'Utilisateur'

  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(displayName)
  const [draftEmail, setDraftEmail] = useState(profile.email)

  const favoriteRecipes = favorites
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = draftName.trim()
    const trimmedEmail = draftEmail.trim()
    if (!trimmedName || !trimmedEmail) return
    const parts = trimmedName.split(/\s+/)
    updateProfile({
      firstName: parts[0] ?? '',
      lastName: parts.slice(1).join(' '),
      email: trimmedEmail,
    })
    setEditing(false)
  }

  function cancelEdit() {
    setDraftName(displayName)
    setDraftEmail(profile.email)
    setEditing(false)
  }

  const initial = displayName.trim().charAt(0).toUpperCase() || 'U'
  const dietLabel = profile.diet ? DIET_LABELS[profile.diet] ?? profile.diet : null
  const allergyLabels = profile.allergies.map((a) => ALLERGEN_LABELS[a] ?? a)

  return (
    <div className="profile">
      <header className="profile-head">
        <h1 className="profile-title">
          Profil
          <TitleWave className="profile-title__wave" width={90} />
        </h1>
      </header>

      <section className="profile-user card">
        {!editing ? (
          <>
            <div className="profile-avatar" aria-hidden>
              <span>{initial}</span>
              <i className="profile-avatar__leaf profile-avatar__leaf--1" />
              <i className="profile-avatar__leaf profile-avatar__leaf--2" />
            </div>
            <div className="profile-user__info">
              <strong>{displayName}</strong>
              <span className="profile-email">{profile.email || '—'}</span>
              <button
                type="button"
                className="profile-edit-btn"
                onClick={() => {
                  setDraftName(displayName)
                  setDraftEmail(profile.email)
                  setEditing(true)
                }}
              >
                <EditIcon />
                Modifier mon profil
              </button>
            </div>
          </>
        ) : (
          <form className="profile-edit-form" onSubmit={saveProfile}>
            <div className="profile-avatar profile-avatar--edit" aria-hidden>
              <span>{(draftName.trim().charAt(0) || 'U').toUpperCase()}</span>
              <i className="profile-avatar__leaf profile-avatar__leaf--1" />
              <i className="profile-avatar__leaf profile-avatar__leaf--2" />
            </div>
            <div className="profile-edit-form__fields">
              <label>
                Nom
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="Votre prénom"
                  autoFocus
                  required
                />
              </label>
              <label>
                E-mail
                <input
                  type="email"
                  value={draftEmail}
                  onChange={(e) => setDraftEmail(e.target.value)}
                  placeholder="vous@email.com"
                  required
                />
              </label>
              <div className="profile-edit-form__actions">
                <button type="button" className="profile-edit-form__cancel" onClick={cancelEdit}>
                  Annuler
                </button>
                <button type="submit" className="profile-edit-form__save">
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        )}
      </section>

      <section className="profile-prefs card">
        <h2>Préférences alimentaires</h2>
        <div className="profile-prefs__row">
          <span className="profile-prefs__label">Habitudes</span>
          <strong>{dietLabel ?? 'Non renseigné'}</strong>
        </div>
        <div className="profile-prefs__row">
          <span className="profile-prefs__label">Allergies</span>
          {allergyLabels.length > 0 ? (
            <div className="profile-prefs__tags">
              {allergyLabels.map((label) => (
                <span key={label} className="profile-prefs__tag">
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <strong>Aucune</strong>
          )}
        </div>
      </section>

      <div className="profile-stats">
        <div className="profile-stat card">
          <div className="profile-stat__icon" aria-hidden>
            <LeafIcon />
          </div>
          <div>
            <strong>{foods.length}</strong>
            <span>aliments suivis</span>
          </div>
        </div>
        <div className="profile-stat card">
          <div className="profile-stat__icon" aria-hidden>
            <HeartOutlineIcon />
          </div>
          <div>
            <strong>{favorites.length}</strong>
            <span>recettes favorites</span>
          </div>
        </div>
      </div>

      <section className="profile-favs card">
        <div className="profile-favs__head">
          <h2>Mes recettes favorites</h2>
        </div>

        {favoriteRecipes.length === 0 ? (
          <p className="profile-favs__empty">
            Aucun favori pour l’instant. Ajoutez-en depuis les suggestions.
          </p>
        ) : (
          <ul className="profile-favs__list">
            {favoriteRecipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={`/recettes/${recipe.id}`} className="profile-fav-item">
                  <span className="profile-fav-item__thumb">
                    {RECIPE_PHOTOS[recipe.id] ? (
                      <img src={RECIPE_PHOTOS[recipe.id]} alt="" />
                    ) : (
                      <span>🍽️</span>
                    )}
                  </span>
                  <strong>{recipe.title}</strong>
                </Link>
                <button
                  type="button"
                  className="profile-fav-item__heart"
                  aria-label="Retirer des favoris"
                  onClick={() => toggleFavorite(recipe.id)}
                >
                  <HeartFilledIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="m13.5 6.5 3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeartOutlineIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function HeartFilledIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12.1 20.3 11 19.3C5.4 14.3 2 11.3 2 7.7 2 4.7 4.4 2.3 7.4 2.3c1.7 0 3.4.8 4.5 2.1 1.1-1.3 2.8-2.1 4.5-2.1C19.4 2.3 22 4.7 22 7.7c0 3.6-3.4 6.6-9 11.6l-.9 1z"
      />
    </svg>
  )
}
