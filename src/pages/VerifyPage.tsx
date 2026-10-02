import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { EmptyState } from '../components/UI'
import { TitleWave } from '../components/TitleWave'
import { foodVisual } from '../utils/foodVisual'
import { isUrgent } from '../utils/helpers'

function expiryLabel(days: number): string {
  if (days <= 0) return 'Expire aujourd’hui'
  if (days === 1) return 'Expire demain'
  return `Expire dans ${days} jours`
}

export function VerifyPage() {
  const {
    scanDraft,
    scanStatus,
    removeScanItem,
    updateScanItem,
    addScanItem,
    validateScan,
    resetScan,
  } = useFridge()
  const navigate = useNavigate()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newQty, setNewQty] = useState('1')
  const [newDays, setNewDays] = useState(5)

  const items = scanDraft
  const isEmpty = items.length === 0 && scanStatus !== 'loading'

  function handleValidate() {
    if (items.length === 0) return
    validateScan()
    navigate('/priorite')
  }

  function handleCancel() {
    resetScan()
    navigate('/scanner')
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    addScanItem(newName, newQty.trim() || '1', Math.max(0, newDays))
    setNewName('')
    setNewQty('1')
    setNewDays(5)
    setShowAdd(false)
  }

  return (
    <div className="verify">
      <header className="verify-head">
        <h1 className="verify-title">
          Vérifie les aliments détectés
          <TitleWave className="verify-title__wave" width={200} />
        </h1>
        <p className="verify-sub">
          {items.length} aliment{items.length !== 1 ? 's' : ''} trouvé
          {items.length !== 1 ? 's' : ''} dans ton frigo
        </p>
      </header>

      <aside className="verify-banner">
        <LeafIcon />
        <p>Vérifie les quantités et les dates avant de continuer.</p>
      </aside>

      {!showAdd ? (
        <button type="button" className="verify-add-btn" onClick={() => setShowAdd(true)}>
          <PlusIcon />
          Ajouter un aliment
        </button>
      ) : (
        <form className="verify-add-form card" onSubmit={handleAdd}>
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
          <div className="verify-add-form__row">
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
              Jours
              <input
                type="number"
                min={0}
                max={60}
                value={newDays}
                onChange={(e) => setNewDays(Math.max(0, Number(e.target.value) || 0))}
              />
            </label>
          </div>
          <div className="verify-add-form__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setShowAdd(false)
                setNewName('')
                setNewQty('1')
                setNewDays(5)
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

      {isEmpty ? (
        <EmptyState
          title="Aucun aliment"
          message="Scannez votre frigo ou ajoutez un aliment manuellement."
          action={
            <button type="button" className="btn btn--secondary" onClick={() => navigate('/scanner')}>
              Aller au scanner
            </button>
          }
        />
      ) : (
        <ul className="verify-list">
          {items.map((item) => {
            const visual = foodVisual(item.name)
            const urgent = isUrgent(item.expiresInDays, 2)
            const editing = editingId === item.id

            return (
              <li key={item.id} className="verify-card">
                <span className="verify-card__thumb" aria-hidden>
                  {visual.photo ? (
                    <img src={visual.photo} alt="" />
                  ) : (
                    <span className="verify-card__emoji" style={{ background: visual.bg }}>
                      {visual.emoji}
                    </span>
                  )}
                </span>

                <div className="verify-card__body">
                  {editing ? (
                    <>
                      <input
                        className="verify-card__name-input"
                        value={item.name}
                        aria-label="Nom"
                        onChange={(e) => updateScanItem(item.id, { name: e.target.value })}
                      />
                      <div className="verify-card__edit-row">
                        <input
                          type="text"
                          value={item.quantity}
                          aria-label="Quantité"
                          onChange={(e) => updateScanItem(item.id, { quantity: e.target.value })}
                        />
                        <input
                          type="number"
                          min={0}
                          max={60}
                          value={item.expiresInDays}
                          aria-label="Jours avant péremption"
                          onChange={(e) =>
                            updateScanItem(item.id, {
                              expiresInDays: Math.max(0, Number(e.target.value) || 0),
                            })
                          }
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <strong className="verify-card__name">{item.name}</strong>
                      <div className="verify-card__badges">
                        <span className="verify-badge verify-badge--qty">{item.quantity}</span>
                        <span
                          className={`verify-badge verify-badge--exp${urgent ? ' is-urgent' : ''}`}
                        >
                          <ClockIcon />
                          {expiryLabel(item.expiresInDays)}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="verify-card__actions">
                  <button
                    type="button"
                    className="verify-icon-btn verify-icon-btn--edit"
                    aria-label={editing ? 'Valider' : 'Modifier'}
                    onClick={() => setEditingId(editing ? null : item.id)}
                  >
                    {editing ? <CheckIcon /> : <EditIcon />}
                  </button>
                  <button
                    type="button"
                    className="verify-icon-btn verify-icon-btn--delete"
                    aria-label="Supprimer"
                    onClick={() => removeScanItem(item.id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <div className="verify-footer">
        <button
          type="button"
          className="btn btn--primary verify-footer__confirm"
          disabled={items.length === 0}
          onClick={handleValidate}
        >
          <CheckIcon />
          Confirmer les aliments
        </button>
        <button type="button" className="verify-footer__cancel" onClick={handleCancel}>
          <CameraIcon />
          Annuler et revenir au scan
        </button>
      </div>
    </div>
  )
}

function LeafIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
      <path d="M5 12.5 10 17.5 19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  )
}
