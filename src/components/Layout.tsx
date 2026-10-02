import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
    </svg>
  )
}

function IconScan() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 0-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3" />
      <path d="M7 12h10" />
    </svg>
  )
}

function IconFridge() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M5 10h14M9 6v2M9 13v3" />
    </svg>
  )
}

function IconRecipes() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 14v6h8v-6" />
      <path d="M6 14h12" />
      <path d="M12 4a4 4 0 0 1 4 4c1.7 0 3 1 3 2.5S19.7 13 18 13H6c-1.7 0-3-1-3-2.5S4.3 8 6 8a4 4 0 0 1 6-4z" />
    </svg>
  )
}

function IconProfile() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19a7 7 0 0 1 14 0" />
    </svg>
  )
}

const mobileLinks = [
  { to: '/', label: 'Accueil', end: true, icon: <IconHome /> },
  { to: '/scanner', label: 'Scanner', icon: <IconScan /> },
  { to: '/frigo', label: 'Mon frigo', icon: <IconFridge /> },
  { to: '/recettes', label: 'Recettes', icon: <IconRecipes /> },
  { to: '/profil', label: 'Profil', icon: <IconProfile /> },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigation mobile">
      {mobileLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `bottom-nav__link${isActive ? ' is-active' : ''}`
          }
        >
          {link.icon}
          <span>{link.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

/** Cadre iPhone 14 — 390×844 pts, encoche (pas Dynamic Island), droit. */
export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation()
  const hideNav =
    location.pathname === '/login' ||
    location.pathname === '/inscription' ||
    location.pathname === '/preferences'

  return (
    <div className="device-stage">
      <div className="phone-scale">
        <div className="phone" aria-label="Aperçu iPhone 14">
          <span className="phone__side phone__side--silent" aria-hidden />
          <span className="phone__side phone__side--vol-up" aria-hidden />
          <span className="phone__side phone__side--vol-down" aria-hidden />
          <span className="phone__side phone__side--power" aria-hidden />

          <div className="phone__frame">
            <div className="phone__screen">
              <div className="phone__notch" aria-hidden>
                <span className="phone__speaker" />
                <span className="phone__camera" />
              </div>

              <div className="phone__status" aria-hidden>
                <span className="phone__time">9:41</span>
                <span className="phone__status-icons">
                  <svg width="17" height="11" viewBox="0 0 17 11" aria-hidden>
                    <rect x="0" y="3" width="3" height="8" rx="0.5" fill="currentColor" opacity="0.35" />
                    <rect x="4.5" y="2" width="3" height="9" rx="0.5" fill="currentColor" opacity="0.55" />
                    <rect x="9" y="0.5" width="3" height="10.5" rx="0.5" fill="currentColor" opacity="0.75" />
                    <rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor" />
                  </svg>
                  <svg width="16" height="11" viewBox="0 0 16 11" aria-hidden>
                    <path
                      d="M8 3.2c1.6 0 3 .7 4 1.8l1.2-1.2A7.2 7.2 0 0 0 8 1.5 7.2 7.2 0 0 0 2.8 3.8L4 5a5.5 5.5 0 0 1 4-1.8z"
                      fill="currentColor"
                    />
                    <path
                      d="M8 6.4c.9 0 1.7.4 2.3 1L12 6a4.8 4.8 0 0 0-8 0l1.7 1.4A3.2 3.2 0 0 1 8 6.4z"
                      fill="currentColor"
                    />
                    <circle cx="8" cy="9.6" r="1.2" fill="currentColor" />
                  </svg>
                  <svg width="25" height="12" viewBox="0 0 25 12" aria-hidden>
                    <rect x="0" y="1" width="21" height="10" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4" />
                    <rect x="1.5" y="2.5" width="15" height="7" rx="1.2" fill="currentColor" />
                    <path d="M22 4v4a2 2 0 0 0 0-4z" fill="currentColor" opacity="0.4" />
                  </svg>
                </span>
              </div>

              <div className={`app-shell${hideNav ? ' app-shell--no-nav' : ''}`}>
                <main className="main">{children}</main>
                {!hideNav && <BottomNav />}
              </div>

              <div id="phone-overlay" className="phone-overlay" />
              <div className="phone__home-indicator" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
