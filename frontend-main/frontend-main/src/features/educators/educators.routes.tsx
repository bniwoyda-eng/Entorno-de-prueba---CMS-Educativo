import { Routes, Route, Navigate } from "react-router-dom";
import { EducatorsLayout } from "./layout";
import { Alerts, Chat, Events, Home, PostById, Posts, PostsByAuthor, ResourceById, Resources, ResourcesByType, Reports } from "./pages";

const EducatorsRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<EducatorsLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/alerts" element={<Alerts />} />

        <Route path="/resources" element={<Resources />} />
        <Route path="/resources/:resourceType" element={<ResourcesByType />} />
        <Route path="/resources/:resourceType/:resourceId" element={<ResourceById />} />

        <Route path="/posts" element={<Posts />} />
        <Route path="/posts/:postId" element={<PostById />} />
        <Route path="/posts/author/:educatorId" element={<PostsByAuthor />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/events" element={<Events />} />

        <Route path="/*" element={<Navigate to="/educators" />} />
      </Route>
    </Routes>
  );
};

export default EducatorsRoutes;
