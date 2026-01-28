import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type Props = {
  children: React.ReactNode;
  allowed: string[];
};

export default function RoleRoute({ children, allowed }: Props) {
  const { role, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!role) return null;

  const ok = allowed.map(r => r.toLowerCase()).includes(role.toLowerCase());
  if (!ok) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
