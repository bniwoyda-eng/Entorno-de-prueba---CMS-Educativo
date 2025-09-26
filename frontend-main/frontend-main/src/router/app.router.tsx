import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";
import AppRoutes from "./app.routes";
import AuthRoutes from "../features/auth/auth.routes";

export const AppRouter = () => {
  const authStatus = useAuthStore((state) => state.status);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  if (authStatus === "authenticating") {
    checkAuthStatus();
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {authStatus === "authenticated" ? (
        <Route path="/*" element={<AppRoutes />} />
      ) : (
        <>
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route path="/*" element={<Navigate to="/auth/login" />} />
        </>
      )}
    </Routes>
  );
};
