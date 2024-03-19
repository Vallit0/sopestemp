import React from 'react';
import { Navigate } from 'react-router-dom';

export function RequireAuth({ children }) {
  const token = localStorage.getItem('token'); // Asumiendo que el token se almacena aquí
  return token ? children : <Navigate to="/login" replace />;
}
