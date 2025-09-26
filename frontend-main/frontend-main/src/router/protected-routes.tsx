// components/ProtectedRoutes.tsx
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../features/auth/auth.store";
import { Role } from "../constants/roles";
import { NotFoundPage } from "../errors";
import { getRedirectPathByRole } from "../utils";

interface ProtectedRoutesProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children, allowedRoles }) => {
  const user = useAuthStore((state) => state.user);
  if (!user) return <NotFoundPage />;

  const hasAccess = user.roles.some((role) => allowedRoles.includes(role));

  if (!hasAccess) {
    const redirectPath = getRedirectPathByRole(user.roles[0]);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
