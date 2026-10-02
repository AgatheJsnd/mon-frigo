import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { EmptyState } from '../components/UI'
import { formatExpiry } from '../utils/helpers'
import type { TimeFilter } from '../types'

export function PriorityPage() {
  const { foods, priorityIds, togglePriority, filters, setFilters } = useFridge()
  const navigate = useNavigate()

  if (foods.length === 0) {
    return (
      <EmptyState
        title="Frigo vide"
        message="Ajoutez des aliments via le scanner pour choisir vos priorités."
        action={
          <button type="button" className="btn btn--primary" onClick={() => navigate('/scanner')}>
            Scanner mon frigo
          </button>
        }
      />
    )
  }

  const candidates = [...foods].sort((a, b) => a.expiresInDays - b.expiresInDays)

  function setTime(maxTime: TimeFilter) {
    setFilters({ maxTime })
  }

  return (
    <div>
      <h1 className="page-title">Quels aliments utiliser en priorité ?</h1>
      <p className="page-sub">
        On a présélectionné ceux qui expirent bientôt. Décochez ceux que vous gardez pour plus
        tard.
      </p>

      <div className="priority-grid">
        <section className="card">
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>Aliments</h2>
          <ul className="check-list">
            {candidates.map((f) => (
              <li key={f.id}>
                <label className="check-item">
                  <input
                    type="checkbox"
                    checked={priorityIds.includes(f.id)}
                    onChange={() => togglePriority(f.id)}
                  />
                  <span>
                    {f.name} · {formatExpiry(f.expiresInDays)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem' }}>Temps disponible</h2>
          <ul className="radio-list">
            {(
              [
                { value: '15' as const, label: 'Moins de 15 min' },
                { value: '30' as const, label: 'Moins de 30 min' },
                { value: 'any' as const, label: 'Peu importe' },
              ] as const
            ).map((opt) => (
              <li key={opt.value}>
                <label className="radio-item">
                  <input
                    type="radio"
                    name="temps"
                    checked={filters.maxTime === opt.value}
                    onChange={() => setTime(opt.value)}
                  />
                  <span>{opt.label}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="btn-row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            setFilters({ urgentOnly: priorityIds.length > 0 })
            navigate('/recettes')
          }}
        >
          Voir les suggestions →
        </button>
      </div>
    </div>
  )
}
