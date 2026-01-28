import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";
import { useAuth } from "../auth/useAuth";

import Home from "../pages/public/Home";
import PropertyDetail from "../pages/public/PropertyDetail";
import DashboardPropertyDetail from "../pages/dashboard/DashboardPropertyDetail";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import ServicesPage from "../pages/public/ServicesPage";
import DocsPage from "../pages/public/DocsPage";
import PartnersPage from "../pages/public/PartnersPage";
import SecurityPage from "../pages/public/SecurityPage";
import PublicPropertiesPage from "../pages/public/PublicPropertiesPage";
import PublicCatalogsPage from "../pages/public/PublicCatalogsPage";
import FavoritesPage from "../pages/public/FavoritesPage";

import DashboardHome from "../pages/dashboard/DashboardHome";
import PropertiesPage from "../pages/dashboard/PropertiesPage";
import CatalogsPage from "../pages/dashboard/CatalogsPage";
import AppointmentsPage from "../pages/dashboard/AppointmentsPage";
import ContractsPage from "../pages/dashboard/ContractsPage";
import TransactionsPage from "../pages/dashboard/TransactionsPage";
import RequestsPage from "../pages/dashboard/RequestsPage";
import ImagesPage from "../pages/dashboard/ImagesPage";
import MailPage from "../pages/dashboard/MailPage";
import AgentsPage from "../pages/dashboard/AgentsPage";
import UsersPage from "../pages/dashboard/UsersPage";
import AdminHome from "../pages/dashboard/AdminHome";
import AgentHome from "../pages/dashboard/AgentHome";
import UserHome from "../pages/dashboard/UserHome";

export default function AppRouter() {
  const { role } = useAuth();
  const roleLower = role?.toLowerCase();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas con fondo oscuro infinito */}
        <Route element={<AppLayout />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PublicPropertiesPage />} />
            <Route path="/properties/:id" element={<PropertyDetail />} />
            <Route path="/catalogs" element={<PublicCatalogsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/partners" element={<PartnersPage />} />
            <Route path="/security" element={<SecurityPage />} />
          </Route>
        </Route>

        {/* Dashboard con su propio layout oscuro */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              !roleLower ? (
                <DashboardHome />
              ) : roleLower === "admin" ? (
                <Navigate to="/dashboard/admin" replace />
              ) : roleLower === "agent" ? (
                <Navigate to="/dashboard/agent" replace />
              ) : (
                <Navigate to="/dashboard/user" replace />
              )
            }
          />

          <Route
            path="admin"
            element={
              <RoleRoute allowed={["admin"]}>
                <AdminHome />
              </RoleRoute>
            }
          />
          <Route
            path="agent"
            element={
              <RoleRoute allowed={["agent"]}>
                <AgentHome />
              </RoleRoute>
            }
          />
          <Route
            path="user"
            element={
              <RoleRoute allowed={["user", "admin", "agent"]}>
                <UserHome />
              </RoleRoute>
            }
          />


          <Route
            path="properties"
            element={
              <RoleRoute allowed={["admin", "agent"]}>
                <PropertiesPage />
              </RoleRoute>
            }
          />
          <Route
            path="property/:id"
            element={
              <RoleRoute allowed={["admin", "agent", "user"]}>
                <DashboardPropertyDetail />
              </RoleRoute>
            }
          />
          <Route
            path="catalogs"
            element={
              <RoleRoute allowed={["admin", "agent"]}>
                <CatalogsPage />
              </RoleRoute>
            }
          />
          <Route
            path="appointments"
            element={
              <RoleRoute allowed={["agent", "user"]}>
                <AppointmentsPage />
              </RoleRoute>
            }
          />
          <Route
            path="contracts"
            element={
              <RoleRoute allowed={["admin", "agent"]}>
                <ContractsPage />
              </RoleRoute>
            }
          />
          <Route
            path="transactions"
            element={
              <RoleRoute allowed={["admin"]}>
                <TransactionsPage />
              </RoleRoute>
            }
          />
          <Route
            path="requests"
            element={
              <RoleRoute allowed={["admin", "agent"]}>
                <RequestsPage />
              </RoleRoute>
            }
          />
          <Route
            path="images"
            element={
              <RoleRoute allowed={["admin", "agent"]}>
                <ImagesPage />
              </RoleRoute>
            }
          />
          <Route
            path="mail"
            element={
              <RoleRoute allowed={["admin", "agent"]}>
                <MailPage />
              </RoleRoute>
            }
          />
          <Route
            path="agents"
            element={
              <RoleRoute allowed={["admin"]}>
                <AgentsPage />
              </RoleRoute>
            }
          />
          <Route
            path="users"
            element={
              <RoleRoute allowed={["admin"]}>
                <UsersPage />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
