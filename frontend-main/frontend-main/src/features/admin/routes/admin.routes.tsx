import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../layout/admin.layout";
import {
  Assessment,
  Assessments,
  QuestionBank,
  QuestionEdit,
  AssesmentTry,
  Dashboard,
} from "../pages";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/self-assessments" element={<Assessments />} />
        <Route path="/self-assessments/:id" element={<Assessment />} />
        <Route path="/self-assessments/:id/try" element={<AssesmentTry />} />

        <Route path="/question-bank" element={<QuestionBank />} />
        <Route path="/question-bank/:id" element={<QuestionEdit />} />

        <Route path="/statistics" element={<div className="text-gray-500 page-base">Not implemented yet.</div>} />
        <Route path="/institutions" element={<div className="text-gray-500 page-base">Not implemented yet.</div>} />
        <Route path="/*" element={<Navigate to="/admin" />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
