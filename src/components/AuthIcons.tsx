import decorTl from '../assets/auth/decor-tl.png'
import decorBr from '../assets/auth/decor-br.png'

/** Décors issus de l’image générée (haut-gauche / bas-droite). */
export function AuthDecor() {
  return (
    <>
      <img src={decorTl} alt="" className="login__decor login__decor--tl" aria-hidden />
      <img src={decorBr} alt="" className="login__decor login__decor--br" aria-hidden />
    </>
  )
}

/** Logo principal transparent : frigo + « Mon frigo » (sans fond carré). */
export function AuthBrand() {
  return (
    <div className="login__brand">
      <svg
        className="login__logo-img"
        viewBox="0 0 160 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Mon frigo"
      >
        <path
          d="M44 46c3-20 26-34 48-32 20 2 36 16 38 34 2 16-8 30-22 37-12 6-30 7-44 2-16-6-24-21-20-41Z"
          fill="#d8e4d4"
        />
        <g stroke="#e09a5c" strokeWidth="2.4" strokeLinecap="round">
          <path d="M108 22l8.5-7.5" />
          <path d="M112 28.5l10.5-2" />
          <path d="M110 34.5l9.5 4.5" />
        </g>
        <rect
          x="58"
          y="22"
          width="44"
          height="60"
          rx="7"
          stroke="#1b4332"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M58 41h44" stroke="#1b4332" strokeWidth="2.6" />
        <path d="M66 29.5v6" stroke="#1b4332" strokeWidth="2.6" strokeLinecap="round" />
        <path d="M66 51v10" stroke="#1b4332" strokeWidth="2.6" strokeLinecap="round" />
        <text
          x="80"
          y="116"
          textAnchor="middle"
          fill="#1b4332"
          fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontWeight="800"
          fontSize="22"
          letterSpacing="-0.03em"
        >
          Mon frigo
        </text>
      </svg>
    </div>
  )
}

export function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.25" y="5.75" width="17.5" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="m5.2 8.2 6.8 5 6.8-5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5.25" y="10.5" width="13.5" height="9.25" rx="2" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="M8.25 10.5V8a3.75 3.75 0 0 1 7.5 0v2.5"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8.25" r="3.4" stroke="currentColor" strokeWidth="1.65" />
      <path
        d="M5.5 19a6.5 6.5 0 0 1 13 0"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.8 12s3.6-5.8 9.2-5.8S21.2 12 21.2 12s-3.6 5.8-9.2 5.8S2.8 12 2.8 12Z"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.45" stroke="currentColor" strokeWidth="1.65" />
    </svg>
  )
}

export function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3.4 3.4 20.6 20.6" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
      <path
        d="M10.3 10.5a2.45 2.45 0 0 0 3.3 3.3"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
      />
      <path
        d="M9.5 5.5A10.5 10.5 0 0 1 12 5.2c6 0 9.4 6.8 9.4 6.8a16.5 16.5 0 0 1-3.2 3.7M6.6 6.9A16 16 0 0 0 2.6 12S6 18.8 12 18.8c1.2 0 2.4-.25 3.4-.65"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ChevronIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function BackIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m15 5-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
