import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  AuthBrand,
  AuthDecor,
  ChevronIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from '../components/AuthIcons'

export function LoginPage() {
  const { isAuthenticated, login, setSignupDraft } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Entrez votre e-mail et votre mot de passe.')
      return
    }
    setError('')
    const local = email.trim().split('@')[0] || 'Utilisateur'
    setSignupDraft({
      firstName: local.charAt(0).toUpperCase() + local.slice(1),
      lastName: '',
      email: email.trim(),
    })
    login()
    navigate('/', { replace: true })
  }

  return (
    <div className="login">
      <AuthDecor />
      <AuthBrand />

      <header className="login__header">
        <h1>Bienvenue !</h1>
        <p>Connectez-vous pour retrouver votre frigo et vos recettes.</p>
      </header>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <label className="login__label" htmlFor="login-email">
          Adresse e-mail
        </label>
        <div className="login__field">
          <span className="login__field-icon" aria-hidden>
            <MailIcon />
          </span>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="login__label" htmlFor="login-password">
          Mot de passe
        </label>
        <div className="login__field">
          <span className="login__field-icon" aria-hidden>
            <LockIcon />
          </span>
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login__eye"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <button type="button" className="login__forgot">
          Mot de passe oublié ?
        </button>

        {error ? <p className="login__error">{error}</p> : null}

        <button type="submit" className="btn btn--primary login__submit">
          Se connecter
          <ChevronIcon />
        </button>
      </form>

      <div className="login__divider" role="separator">
        <span>ou</span>
      </div>

      <aside className="login__signup">
        <p>Pas encore de compte ?</p>
        <button type="button" className="login__signup-link" onClick={() => navigate('/inscription')}>
          Créer un compte
        </button>
      </aside>
    </div>
  )
}
