import React from "react";
import { Navigate } from "react-router-dom";
import { authStorage } from "../auth/auth.storage";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
  const token = authStorage.getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
