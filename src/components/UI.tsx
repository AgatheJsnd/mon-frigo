import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  title: string
  children: ReactNode
  onClose: () => void
  icon?: ReactNode
  centered?: boolean
}

export function Modal({ title, children, onClose, icon, centered = false }: ModalProps) {
  const [mount, setMount] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMount(document.getElementById('phone-overlay'))
  }, [])

  const content = (
    <div
      className={`modal-backdrop${centered ? ' modal-backdrop--center' : ''}`}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className={`modal${centered ? ' modal--center' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Fermer">
          ×
        </button>
        {icon && <div className="modal__icon">{icon}</div>}
        <h2 id="modal-title" className="modal__title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  )

  if (!mount) return content
  return createPortal(content, mount)
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string
  message: string
  action?: ReactNode
}) {
  return (
    <div className="state-box card">
      <h2>{title}</h2>
      <p>{message}</p>
      {action}
    </div>
  )
}

export function LoadingState({ message = 'Chargement…' }: { message?: string }) {
  return (
    <div className="state-box card" role="status" aria-live="polite">
      <h2>{message}</h2>
      <p>Patientez quelques secondes.</p>
    </div>
  )
}
