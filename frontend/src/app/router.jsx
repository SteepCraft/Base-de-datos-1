/**
 * @module app/router
 * @description Centraliza la configuración de rutas del panel administrativo (módulo core).
 * Compatible con migración a TypeScript.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../components/auth";
import { DynamicDashboard } from "../components/dashboard";

// Pages
import LoginPage from "../pages/LoginPage";
import ProfilePage from "../pages/ProfilePage";
import RoleSelectionPage from "../pages/RoleSelectionPage";

// Feature Pages
import UsersPage from "../features/user-management/pages/UsersPage";
import InstitutionsPage from "../features/institution-management/pages/InstitutionsPage";
import MembershipsPage from "../features/membership-management/pages/MembershipsPage";

/**
 * Componente que define y exporta las rutas principales de la aplicación.
 * @returns {React.ReactElement}
 */
export default function AppRouter() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path='/login' element={<LoginPage />} />

      {/* Rutas protegidas - Perfil y selección de rol */}
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path='/select-role'
        element={
          <ProtectedRoute>
            <RoleSelectionPage />
          </ProtectedRoute>
        }
      />

      {/* Dashboard dinámico basado en rol */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DynamicDashboard />
          </ProtectedRoute>
        }
      />

      {/* ✅ PÁGINAS DEL PANEL ADMINISTRATIVO */}
      {/* Gestión de usuarios - Admin o SedeAdmin del módulo core */}
      <Route
        path='/users'
        element={
          <ProtectedRoute allowedRoles={["admin", "sedeadmin"]}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      {/* Gestión de instituciones - Solo admin de Ges2l */}
      <Route
        path='/institutions'
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <InstitutionsPage />
          </ProtectedRoute>
        }
      />

      {/* Gestión de membresías - Solo admin de Ges2l */}
      <Route
        path='/memberships'
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MembershipsPage />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path='/' element={<Navigate to='/dashboard' replace />} />
      <Route path='*' element={<Navigate to='/dashboard' replace />} />
    </Routes>
  );
}
