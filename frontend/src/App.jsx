import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminSkills from "./pages/AdminSkills";
import AdminServices from "./pages/AdminServices";
import AdminExperience from "./pages/AdminExperience";
import AdminEducation from "./pages/AdminEducation";
import AdminCertifications from "./pages/AdminCertifications";
import AdminGallery from "./pages/AdminGallery";
import AdminMessages from "./pages/AdminMessages";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />

        {/* Admin */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}
        />

        <Route
          path="/admin/projects"
          element={<ProtectedRoute><AdminProjects /></ProtectedRoute>}
        />

        <Route
          path="/admin/skills"
          element={<ProtectedRoute><AdminSkills /></ProtectedRoute>}
        />

        <Route
          path="/admin/services"
          element={<ProtectedRoute><AdminServices /></ProtectedRoute>}
        />

        <Route
          path="/admin/experience"
          element={<ProtectedRoute><AdminExperience /></ProtectedRoute>}
        />

        <Route
          path="/admin/education"
          element={<ProtectedRoute><AdminEducation /></ProtectedRoute>}
        />

        <Route
          path="/admin/certifications"
          element={<ProtectedRoute><AdminCertifications /></ProtectedRoute>}
        />

        <Route
          path="/admin/gallery"
          element={<ProtectedRoute><AdminGallery /></ProtectedRoute>}
        />

        <Route
          path="/admin/messages"
          element={<ProtectedRoute><AdminMessages /></ProtectedRoute>}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
