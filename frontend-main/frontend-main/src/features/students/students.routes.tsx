import { Routes, Route, Navigate } from "react-router-dom";

import { StudentsLayout } from "./layout";

import {
  Home,
  SelfAssessmentPage,
  ChangePasswordPage,
  EventsPage,
  SelfAssessmentsPage,
} from "./pages";

const StudentsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentsLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        <Route path="/upcoming-events" element={<EventsPage />} />
        <Route path="/self-assessments" element={<SelfAssessmentsPage />} />
        <Route path="/self-assessments/:id" element={<SelfAssessmentPage />} />

        <Route path="/*" element={<Navigate to="/students" />} />
      </Route>
    </Routes>
  );
};

export default StudentsRoutes;
