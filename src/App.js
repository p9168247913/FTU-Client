import './assets/css/App.css';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import { useState } from 'react';


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth/sign-in" replace />;
};

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* Auth routes accessible without a token */}
        <Route path="auth/*" element={<AuthLayout />} />
        
        {/* Protect /admin routes */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            </ProtectedRoute>
          }
        />

        {/* Redirect root path to /admin or /auth/sign-in depending on token */}
        <Route
          path="/"
          element={
            localStorage.getItem('token') ? (
              <Navigate to="/admin" replace />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />
      </Routes>
    </ChakraProvider>
  );
}
