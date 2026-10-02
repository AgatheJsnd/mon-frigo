import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  AuthBrand,
  AuthDecor,
  BackIcon,
  ChevronIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from '../components/AuthIcons'

export function SignupPage() {
  const { isAuthenticated, setSignupDraft } = useAuth()
  const navigate = useNavigate()
  const [lastName, setLastName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!lastName.trim() || !firstName.trim() || !email.trim() || !password.trim()) {
      setError('Remplissez tous les champs pour continuer.')
      return
    }
    setError('')
    setSignupDraft({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    })
    navigate('/preferences')
  }

  return (
    <div className="login signup">
      <AuthDecor />

      <button
        type="button"
        className="signup__back"
        aria-label="Retour"
        onClick={() => navigate('/login')}
      >
        <BackIcon />
      </button>

      <AuthBrand />

      <header className="login__header">
        <h1>Créer un compte</h1>
        <p>Créez votre compte pour retrouver votre frigo et vos recettes.</p>
      </header>

      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <label className="login__label" htmlFor="signup-lastname">
          Nom
        </label>
        <div className="login__field">
          <span className="login__field-icon" aria-hidden>
            <UserIcon />
          </span>
          <input
            id="signup-lastname"
            type="text"
            autoComplete="family-name"
            placeholder="Votre nom"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <label className="login__label" htmlFor="signup-firstname">
          Prénom
        </label>
        <div className="login__field">
          <span className="login__field-icon" aria-hidden>
            <UserIcon />
          </span>
          <input
            id="signup-firstname"
            type="text"
            autoComplete="given-name"
            placeholder="Votre prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <label className="login__label" htmlFor="signup-email">
          Adresse e-mail
        </label>
        <div className="login__field">
          <span className="login__field-icon" aria-hidden>
            <MailIcon />
          </span>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder="Votre adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="login__label" htmlFor="signup-password">
          Mot de passe
        </label>
        <div className="login__field">
          <span className="login__field-icon" aria-hidden>
            <LockIcon />
          </span>
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Choisissez un mot de passe"
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

        {error ? <p className="login__error">{error}</p> : null}

        <button type="submit" className="btn btn--primary login__submit signup__submit">
          Poursuivre la création du compte
          <ChevronIcon />
        </button>
      </form>

      <p className="signup__footer">
        Déjà un compte ?{' '}
        <button type="button" className="signup__login-link" onClick={() => navigate('/login')}>
          Se connecter
        </button>
      </p>
    </div>
  )
}
