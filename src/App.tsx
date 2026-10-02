import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FridgeProvider } from './context/FridgeContext'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { ScannerPage } from './pages/ScannerPage'
import { VerifyPage } from './pages/VerifyPage'
import { PriorityPage } from './pages/PriorityPage'
import { RecipesPage } from './pages/RecipesPage'
import { RecipeDetailPage } from './pages/RecipeDetailPage'
import { CookSuccessPage } from './pages/CookSuccessPage'
import { FridgePage } from './pages/FridgePage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { PreferencesPage } from './pages/PreferencesPage'

function ProtectedRoutes() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/inscription" element={<SignupPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route path="/inscription" element={<Navigate to="/" replace />} />
      <Route path="/preferences" element={<Navigate to="/" replace />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/scanner" element={<ScannerPage />} />
      <Route path="/verification" element={<VerifyPage />} />
      <Route path="/priorite" element={<PriorityPage />} />
      <Route path="/recettes" element={<RecipesPage />} />
      <Route path="/recettes/:id" element={<RecipeDetailPage />} />
      <Route path="/bon-appetit" element={<CookSuccessPage />} />
      <Route path="/frigo" element={<FridgePage />} />
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <FridgeProvider>
        <BrowserRouter>
          <Layout>
            <ProtectedRoutes />
          </Layout>
        </BrowserRouter>
      </FridgeProvider>
    </AuthProvider>
  )
}
