import { Navigate, Route, Routes } from "react-router-dom";

import { Roles } from "../constants/roles";
import ProtectedRoutes from "./protected-routes";
import CoursesRoutes from "../features/common/courses/courses.routes";
import EducatorsRoutes from "../features/educators/educators.routes";
import StudentsRoutes from "../features/students/students.routes";
import AdminRoutes from "../features/admin/routes/admin.routes";

import { useAuthStore } from "../features/auth/auth.store";
import { getRedirectPathByRole } from "../utils";
const AppRoutes = () => {
  const mainRole = useAuthStore((state) => state.user?.roles[0]);
  const redirectPath = getRedirectPathByRole(mainRole);

  return (
    <Routes>
      <Route
        path="/courses/*"
        element={
          <ProtectedRoutes allowedRoles={[Roles.STUDENT, Roles.EDUCATOR]}>
            <CoursesRoutes />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/students/*"
        element={
          <ProtectedRoutes allowedRoles={[Roles.STUDENT]}>
            <StudentsRoutes />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/educators/*"
        element={
          <ProtectedRoutes allowedRoles={[Roles.EDUCATOR]}>
            <EducatorsRoutes />
          </ProtectedRoutes>
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoutes allowedRoles={[Roles.ADMIN]}>
            <AdminRoutes />
          </ProtectedRoutes>
        }
      />

      <Route path="*" element={<Navigate to={redirectPath} replace />} />
    </Routes>
  );
};

export default AppRoutes;
