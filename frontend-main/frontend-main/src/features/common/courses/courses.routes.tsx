import { Routes, Route, Navigate } from "react-router-dom";
import { CoursesPage, CoursePage, CourseMaterialPage } from "./pages";
import { useAuthStore } from "../../auth/auth.store";
import { StudentsLayout } from "../../students/layout";
import { EducatorsLayout } from "../../educators/layout";

const CoursesRoutes = () => {
  const mainRole = useAuthStore((state) => state.user?.roles[0]) as 'student' | 'educator';

  return (
    <Routes>
      {mainRole === 'student' && (
        <Route element={<StudentsLayout />}>
          <Route index path="/" element={<CoursesPage />} />
          <Route path="/:courseId" element={<CoursePage />} />
          <Route path="/:courseId/material/:materialId" element={<CourseMaterialPage />} />
        </Route>
      )}

      {mainRole === "educator" && (
        <Route element={<EducatorsLayout />}>
          <Route index path="/" element={<CoursesPage />} />
          <Route path="/:courseId" element={<CoursePage />} />
          <Route path="/:courseId/material/:materialId" element={<CourseMaterialPage />} />
        </Route>
      )}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default CoursesRoutes;
