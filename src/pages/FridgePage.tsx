import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { EmptyState } from '../components/UI'
import { isUrgent } from '../utils/helpers'
import { foodVisual } from '../utils/foodVisual'
import { TitleWave } from '../components/TitleWave'

type FridgeFilter = 'all' | 'urgent'

function expiryLabel(days: number): string {
  if (days <= 0) return 'Expire aujourd’hui'
  if (days === 1) return 'Expire demain'
  return `Expirent dans ${days} jours`
}

function toDateInputValue(daysFromNow: number): string {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().slice(0, 10)
}

function daysUntilDate(isoDate: string): number {
  if (!isoDate) return 5
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const target = new Date(`${isoDate}T12:00:00`)
  const diff = Math.round((target.getTime() - today.getTime()) / 86_400_000)
  return Math.max(0, diff)
}

export function FridgePage() {
  const { foods, removeFood, updateFood, addFood, urgentFoods } = useFridge()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FridgeFilter>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('1')
  const [newExpiry, setNewExpiry] = useState(() => toDateInputValue(5))

  const sorted = useMemo(
    () => [...foods].sort((a, b) => a.expiresInDays - b.expiresInDays),
    [foods],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sorted.filter((f) => {
      if (filter === 'urgent' && !isUrgent(f.expiresInDays, 3)) return false
      if (q && !f.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [sorted, filter, query])

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    addFood(newName.trim(), newQty.trim() || '1', daysUntilDate(newExpiry))
    setNewName('')
    setNewQty('1')
    setNewExpiry(toDateInputValue(5))
    setShowAdd(false)
  }

  const previewDays = daysUntilDate(newExpiry)

  return (
    <div className="fridge">
      <header className="fridge-head">
        <h1 className="fridge-title">
          Mon frigo
          <TitleWave className="fridge-title__wave" width={120} />
        </h1>
        <button
          type="button"
          className="fridge-add-btn"
          onClick={() => setShowAdd((v) => !v)}
        >
          + Ajouter
        </button>
      </header>

      <section className="fridge-summary">
        <div className="fridge-summary__cell">
          <FridgeIcon />
          <div>
            <strong>
              {foods.length} aliment{foods.length !== 1 ? 's' : ''}
            </strong>
            <span>dans mon frigo</span>
          </div>
        </div>
        <div className="fridge-summary__divider" aria-hidden />
        <div className="fridge-summary__cell">
          <span className="fridge-summary__warn" aria-hidden>
            ▲
          </span>
          <div>
            <strong>
              {urgentFoods.length} à utiliser vite
            </strong>
            <span>pour éviter le gaspillage</span>
          </div>
        </div>
      </section>

      <div className="fridge-search">
        <SearchIcon />
        <input
          type="search"
          placeholder="Rechercher un aliment"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un aliment"
        />
      </div>

      <div className="fridge-filters" role="group" aria-label="Filtres">
        <button
          type="button"
          className={`fridge-chip${filter === 'all' ? ' is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Tout
        </button>
        <button
          type="button"
          className={`fridge-chip${filter === 'urgent' ? ' is-active' : ''}`}
          onClick={() => setFilter('urgent')}
        >
          À utiliser vite
        </button>
      </div>

      {showAdd && (
        <form className="fridge-add-form card" onSubmit={handleAdd}>
          <label>
            Nom
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex. : courgette"
              autoFocus
              required
            />
          </label>
          <label>
            Quantité
            <input
              type="text"
              value={newQty}
              onChange={(e) => setNewQty(e.target.value)}
              placeholder="1"
            />
          </label>
          <label>
            Date de péremption
            <input
              type="date"
              value={newExpiry}
              min={toDateInputValue(0)}
              onChange={(e) => setNewExpiry(e.target.value)}
              required
            />
          </label>
          {newExpiry && (
            <p
              className={`fridge-add-form__preview${isUrgent(previewDays, 3) ? ' is-urgent' : ''}`}
            >
              {expiryLabel(previewDays)}
            </p>
          )}
          <div className="fridge-add-form__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setShowAdd(false)
                setNewName('')
                setNewQty('1')
                setNewExpiry(toDateInputValue(5))
              }}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn--primary">
              Ajouter
            </button>
          </div>
        </form>
      )}

      {foods.length === 0 ? (
        <EmptyState
          title="Frigo vide"
          message="Aucun aliment enregistré. Lancez un scan ou ajoutez-en manuellement."
          action={
            <Link to="/scanner" className="btn btn--primary">
              Scanner mon frigo
            </Link>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyState
          title="Aucun résultat"
          message="Aucun aliment ne correspond à votre recherche ou au filtre."
          action={
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setQuery('')
                setFilter('all')
              }}
            >
              Réinitialiser
            </button>
          }
        />
      ) : (
        <ul className="fridge-list">
          {visible.map((item) => {
            const visual = foodVisual(item.name)
            const urgent = isUrgent(item.expiresInDays, 3)
            const editing = editingId === item.id

            return (
              <li key={item.id} className="fridge-card">
                <span className="fridge-card__thumb" aria-hidden>
                  {visual.photo ? (
                    <img src={visual.photo} alt="" />
                  ) : (
                    <span className="fridge-card__emoji" style={{ background: visual.bg }}>
                      {visual.emoji}
                    </span>
                  )}
                </span>

                <div className="fridge-card__body">
                  {editing ? (
                    <>
                      <input
                        className="fridge-card__name-input"
                        value={item.name}
                        aria-label="Nom"
                        onChange={(e) => updateFood(item.id, { name: e.target.value })}
                      />
                      <div className="fridge-card__edit-row">
                        <input
                          type="text"
                          value={item.quantity}
                          aria-label="Quantité"
                          onChange={(e) => updateFood(item.id, { quantity: e.target.value })}
                        />
                        <input
                          type="number"
                          min={0}
                          max={60}
                          value={item.expiresInDays}
                          aria-label="Jours avant péremption"
                          onChange={(e) =>
                            updateFood(item.id, {
                              expiresInDays: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <strong className="fridge-card__name">{item.name}</strong>
                      <span className="fridge-card__qty">{item.quantity}</span>
                      <span
                        className={`fridge-badge${urgent ? ' fridge-badge--urgent' : ''}`}
                      >
                        <ClockIcon />
                        {expiryLabel(item.expiresInDays)}
                      </span>
                    </>
                  )}
                </div>

                <div className="fridge-card__actions">
                  <button
                    type="button"
                    className="fridge-icon-btn fridge-icon-btn--edit"
                    aria-label={editing ? 'Valider' : 'Modifier'}
                    onClick={() => setEditingId(editing ? null : item.id)}
                  >
                    {editing ? <CheckIcon /> : <EditIcon />}
                  </button>
                  <button
                    type="button"
                    className="fridge-icon-btn fridge-icon-btn--delete"
                    aria-label="Supprimer"
                    onClick={() => removeFood(item.id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function FridgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M6 10h12M10 6v2M10 13v3" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v5l3 2" strokeLinecap="round" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 20h9" strokeLinecap="round" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M9 10v8M15 10v8M6 6l1 14h10l1-14" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}