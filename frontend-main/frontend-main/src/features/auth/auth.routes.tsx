import { Routes, Route, Navigate } from "react-router-dom";

import { AuthLayout } from "./auth.layout";
import { LoginPage, ForgotPasswordPage, RecoverPasswordPage } from "./pages";

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Navigate to="/auth/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Route>
    </Routes>
  );
};

export default AuthRoutes;
