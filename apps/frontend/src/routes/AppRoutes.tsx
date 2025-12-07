// src/Routes.tsx
import { Header } from '@/components/layout/Header';
import { ProtectedRoute } from '@/components/ProtectedRoutes';
import LoginPage from '@/pages/auth/LoginPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
const ProtectedLayout = () => {
  return (
    <ProtectedRoute> 
      <div className="min-h-screen bg-background">
        <main className=" flex flex-col gap-8">
          <Header />
          <Outlet /> 
        </main>
      </div>
    </ProtectedRoute>
  )
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}
