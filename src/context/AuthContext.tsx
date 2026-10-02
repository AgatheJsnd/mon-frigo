import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type UserProfile = {
  firstName: string
  lastName: string
  email: string
  diet: string | null
  allergies: string[]
}

type AuthContextValue = {
  isAuthenticated: boolean
  profile: UserProfile
  setSignupDraft: (draft: Pick<UserProfile, 'firstName' | 'lastName' | 'email'>) => void
  setPreferences: (diet: string | null, allergies: string[]) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  login: () => void
  logout: () => void
}

const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  diet: null,
  allergies: [],
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  const setSignupDraft = useCallback(
    (draft: Pick<UserProfile, 'firstName' | 'lastName' | 'email'>) => {
      setProfile((prev) => ({ ...prev, ...draft }))
    },
    [],
  )

  const setPreferences = useCallback((diet: string | null, allergies: string[]) => {
    setProfile((prev) => ({ ...prev, diet, allergies }))
  }, [])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const login = useCallback(() => setIsAuthenticated(true), [])
  const logout = useCallback(() => {
    setIsAuthenticated(false)
    setProfile(defaultProfile)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        profile,
        setSignupDraft,
        setPreferences,
        updateProfile,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
