import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { EmptyState } from '../components/UI'
import { TitleWave } from '../components/TitleWave'
import { formatExpiry, matchFoodName } from '../utils/helpers'
import { RECIPE_PHOTOS } from '../utils/recipePhotos'

export function RecipesPage() {
  const {
    foods,
    filteredRecipes,
    filters,
    setFilters,
    selectedRecipeId,
    setSelectedRecipeId,
    priorityIds,
    ingredientStatus,
    favorites,
    toggleFavorite,
  } = useFridge()
  const navigate = useNavigate()
  const [moreFilters, setMoreFilters] = useState(false)

  const urgentFoods = useMemo(
    () =>
      [...foods]
        .filter((f) => priorityIds.includes(f.id) || f.expiresInDays <= 3)
        .sort((a, b) => a.expiresInDays - b.expiresInDays),
    [foods, priorityIds],
  )

  const urgentLabel = urgentFoods
    .slice(0, 2)
    .map((f) => f.name)
    .join(' · ')

  if (foods.length === 0) {
    return (
      <div className="recipes">
        <h1 className="recipes-title">
          Que puis-je cuisiner ce soir&nbsp;?
          <TitleWave className="recipes-title__wave" width={210} />
        </h1>
        <EmptyState
          title="Aucun aliment"
          message="Scannez votre frigo pour obtenir des suggestions adaptées."
          action={
            <button type="button" className="btn btn--primary" onClick={() => navigate('/scanner')}>
              Scanner mon frigo
            </button>
          }
        />
      </div>
    )
  }

  return (
    <div className="recipes">
      <header className="recipes-head">
        <div className="recipes-head__row">
          <h1 className="recipes-title">
            Que puis-je cuisiner ce soir&nbsp;?
            <TitleWave className="recipes-title__wave" width={210} />
          </h1>
          <span className="recipes-count">
            {filteredRecipes.length} recette{filteredRecipes.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="recipes-sub">
          Avec les {foods.length} aliment{foods.length !== 1 ? 's' : ''} de votre frigo
        </p>
      </header>

      {urgentFoods.length > 0 && (
        <div className="recipes-urgent">
          <span className="recipes-urgent__icon" aria-hidden>
            <LeafIcon />
          </span>
          <div className="recipes-urgent__text">
            <strong>À utiliser vite</strong>
            <span>{urgentLabel || 'Aliments bientôt périmés'}</span>
          </div>
          <div className="recipes-urgent__divider" aria-hidden />
          <Link to="/frigo" className="recipes-urgent__edit">
            <EditIcon />
            Modifier mon frigo
          </Link>
        </div>
      )}

      <div className="recipes-filters" role="group" aria-label="Filtres">
        <button
          type="button"
          className={`recipes-filter${filters.maxTime === '30' ? ' is-active' : ''}`}
          onClick={() => setFilters({ maxTime: filters.maxTime === '30' ? 'any' : '30' })}
        >
          <ClockIcon />
          Moins de 30 min
        </button>
        <button
          type="button"
          className={`recipes-filter${filters.vegetarian ? ' is-active' : ''}`}
          onClick={() => setFilters({ vegetarian: !filters.vegetarian })}
        >
          <LeafIcon />
          Végétarien
        </button>
        <button
          type="button"
          className={`recipes-filter${moreFilters || filters.urgentOnly || filters.maxTime === '15' ? ' is-active' : ''}`}
          onClick={() => setMoreFilters((v) => !v)}
        >
          <SlidersIcon />
          Filtres
        </button>
      </div>

      {moreFilters && (
        <div className="recipes-filters recipes-filters--extra" role="group" aria-label="Filtres avancés">
          <button
            type="button"
            className={`recipes-filter${filters.maxTime === '15' ? ' is-active' : ''}`}
            onClick={() => setFilters({ maxTime: filters.maxTime === '15' ? 'any' : '15' })}
          >
            Moins de 15 min
          </button>
          <button
            type="button"
            className={`recipes-filter${filters.urgentOnly ? ' is-active' : ''}`}
            onClick={() => setFilters({ urgentOnly: !filters.urgentOnly })}
          >
            Priorité péremption
          </button>
          <button
            type="button"
            className="recipes-filter"
            onClick={() => {
              setFilters({ urgentOnly: false, maxTime: 'any', vegetarian: false })
              setMoreFilters(false)
            }}
          >
            Réinitialiser
          </button>
        </div>
      )}

      {filteredRecipes.length === 0 ? (
        <EmptyState
          title="Aucune suggestion"
          message="Aucun résultat pour ces filtres. Désactivez un filtre ou ajoutez des aliments."
          action={
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setFilters({ urgentOnly: false, maxTime: 'any', vegetarian: false })}
            >
              Réinitialiser les filtres
            </button>
          }
        />
      ) : (
        <div className="recipes-list">
          {filteredRecipes.map((recipe, index) => {
            const status = ingredientStatus(recipe)
            const isFav = favorites.includes(recipe.id)
            const photo = RECIPE_PHOTOS[recipe.id]
            const priorityFood = foods.find(
              (f) =>
                (priorityIds.includes(f.id) || f.expiresInDays <= 3) &&
                recipe.ingredients.some((ing) => matchFoodName(ing.name, f.name)),
            )
            const isPriority = Boolean(priorityFood) && index === 0

            return (
              <article
                key={recipe.id}
                className={`recipes-card${selectedRecipeId === recipe.id ? ' is-selected' : ''}`}
              >
                <div className="recipes-card__photo">
                  {photo ? (
                    <img src={photo} alt="" className="recipes-card__img" />
                  ) : (
                    <span className="recipes-card__fallback" aria-hidden>
                      🍽️
                    </span>
                  )}
                  {isPriority && (
                    <span className="recipes-card__priority">
                      <StarIcon />
                      À cuisiner en priorité
                    </span>
                  )}
                </div>

                <div className="recipes-card__content">
                  <h2>{recipe.title}</h2>

                  <div className="recipes-card__meta">
                    <span>
                      <ClockIcon />
                      {recipe.timeMin} min
                    </span>
                    {recipe.vegetarian ? (
                      <span>
                        <LeafIcon />
                        Végétarien
                      </span>
                    ) : (
                      <span>
                        <UtensilsIcon />
                        {status.fridgeCount} aliment{status.fridgeCount > 1 ? 's' : ''} de votre
                        frigo
                      </span>
                    )}
                  </div>

                  {priorityFood && (
                    <div className="recipes-card__alert">
                      <LeafIcon />
                      Utilise vos {priorityFood.name.toLowerCase()} (
                      {formatExpiry(priorityFood.expiresInDays)})
                    </div>
                  )}

                  <div className="recipes-card__footer">
                    <Link
                      to={`/recettes/${recipe.id}`}
                      className="recipes-card__detail"
                      onClick={() => setSelectedRecipeId(recipe.id)}
                    >
                      Voir le détail ›
                    </Link>
                    <button
                      type="button"
                      className={`recipes-card__fav${isFav ? ' is-fav' : ''}`}
                      aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                      onClick={() => toggleFavorite(recipe.id)}
                    >
                      <HeartIcon filled={isFav} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" strokeLinecap="round" />
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
      <path d="M5 19c0-6 4-10 10-12" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}

function SlidersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 8h10M18 8h2M4 16h2M10 16h10" strokeLinecap="round" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="8" cy="16" r="2" />
    </svg>
  )
}

function UtensilsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3v6a2 2 0 0 1-2 2h0V21" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 3l2.7 5.5 6 .9-4.4 4.3 1 6L12 17.8 6.7 19.7l1-6L3.3 9.4l6-.9L12 3z" />
    </svg>
  )
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M12 20s-7-4.4-9.5-8.2C.5 8.5 2.4 5 6 5c2 0 3.3 1.2 4 2.2C10.7 6.2 12 5 14 5c3.6 0 5.5 3.5 3.5 6.8C19 15.6 12 20 12 20z" />
    </svg>
  )
}
