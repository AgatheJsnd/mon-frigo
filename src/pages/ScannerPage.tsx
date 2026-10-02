import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFridge } from '../context/FridgeContext'
import { EmptyState } from '../components/UI'
import fridgeInterior from '../assets/scan/fridge-interior.png'

export function ScannerPage() {
  const { startScan, scanStatus, resetScan } = useFridge()
  const navigate = useNavigate()
  const [localError, setLocalError] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleCapture() {
    setLocalError(false)
    const result = await startScan()
    if (result === 'success' || result === 'empty') {
      navigate('/verification')
      return
    }
    setLocalError(true)
  }

  function onPickGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const loading = scanStatus === 'loading'
  const viewImg = preview ?? fridgeInterior

  return (
    <div className="scan-page">
      <header className="scan-page__header">
        <h1 className="scan-page__title">
          Prenez votre frigo en photo
          <svg className="scan-page__wave" viewBox="0 0 220 12" aria-hidden>
            <path
              d="M2 8 C 35 2, 65 11, 100 7 S 165 2, 218 8"
              fill="none"
              stroke="#b7d4bc"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </h1>
      </header>

      <div className={`scan-viewfinder${loading ? ' is-loading' : ''}`}>
        <img
          src={viewImg}
          alt={preview ? 'Aperçu sélectionné' : 'Intérieur du frigo'}
          className="scan-viewfinder__img"
        />

        <span className="scan-corner scan-corner--tl" aria-hidden />
        <span className="scan-corner scan-corner--tr" aria-hidden />
        <span className="scan-corner scan-corner--bl" aria-hidden />
        <span className="scan-corner scan-corner--br" aria-hidden />

        <div className="scan-viewfinder__hint">
          {loading ? 'Analyse en cours…' : 'Cadrez tout l’intérieur du frigo'}
        </div>
      </div>

      {(localError || scanStatus === 'error') && (
        <EmptyState
          title="Erreur de scan"
          message="Impossible d’analyser la photo. Réessayez ou saisissez vos aliments manuellement."
          action={
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  resetScan()
                  setLocalError(false)
                  void handleCapture()
                }}
              >
                Réessayer
              </button>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  resetScan()
                  navigate('/verification')
                }}
              >
                Saisie manuelle
              </button>
            </div>
          }
        />
      )}

      <div className="scan-controls">
        <button
          type="button"
          className="scan-ctrl"
          aria-label="Choisir une photo"
          disabled={loading}
          onClick={() => fileRef.current?.click()}
        >
          <GalleryIcon />
        </button>

        <button
          type="button"
          className="scan-shutter"
          aria-label="Prendre la photo"
          disabled={loading}
          onClick={() => void handleCapture()}
        >
          <span className="scan-shutter__ring" />
          <span className="scan-shutter__core" />
        </button>

        <button
          type="button"
          className="scan-ctrl"
          aria-label="Retourner la caméra"
          disabled={loading}
          onClick={() => {
            /* Prototype : pas de caméra réelle — le flip est décoratif */
          }}
        >
          <FlipCameraIcon />
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="scan-file"
        onChange={onPickGallery}
      />

      <aside className="scan-tip">
        <span className="scan-tip__icon" aria-hidden>
          <BulbIcon />
        </span>
        <div>
          <h2>Incluez toutes les étagères</h2>
          <p>
            Pensez à bien montrer le haut, le milieu, le bas et les bacs de votre frigo.
          </p>
        </div>
      </aside>
    </div>
  )
}

function GalleryIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
      <path d="m21 16-5.5-5.5L9 17" />
    </svg>
  )
}

function FlipCameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 8h3l2-2h6l2 2h3v10H4V8z" />
      <path d="M9 13a3 3 0 0 0 5.2 2M15 13a3 3 0 0 0-5.2-2" strokeLinecap="round" />
      <path d="M14.5 10.5 15 13l-2.5.2M9.5 15.5 9 13l2.5-.2" strokeLinecap="round" />
    </svg>
  )
}

function BulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path d="M12 3a6 6 0 0 0-3.5 10.8c.6.5 1 1.2 1.1 2h4.8c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" />
    </svg>
  )
}
