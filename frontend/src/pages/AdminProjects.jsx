import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  image: "",
  technologies: "",
  githubLink: "",
  liveLink: "",
  category: "Web Development",
  featured: false
};

function AdminProjects() {
  const { token } = useAuth();

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD PROJECTS
  // =========================
  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(endpoints.projects, token);

      setProjects(data);
    } catch (error) {
      console.error("Failed to load projects:", error);

      setError(
        error.message || "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadProjects();
    }
  }, [token, loadProjects]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  // =========================
  // SUBMIT FORM
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const projectData = {
        title: form.title.trim(),
        description: form.description.trim(),
        image: form.image.trim(),

        technologies: form.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),

        githubLink: form.githubLink.trim(),
        liveLink: form.liveLink.trim(),
        category: form.category.trim(),
        featured: form.featured
      };

      if (editingId) {
        await api.put(
          `${endpoints.projects}/${editingId}`,
          projectData,
          token
        );

        setStatus("Project updated successfully.");
      } else {
        await api.post(
          endpoints.projects,
          projectData,
          token
        );

        setStatus("Project added successfully.");
      }

      resetForm();
      await loadProjects();
    } catch (error) {
      console.error("Failed to save project:", error);

      setError(
        error.message || "Failed to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT PROJECT
  // =========================
  const handleEdit = (project) => {
    setEditingId(project._id);

    setForm({
      title: project.title || "",
      description: project.description || "",
      image: project.image || "",

      technologies:
        project.technologies?.join(", ") || "",

      githubLink: project.githubLink || "",
      liveLink: project.liveLink || "",
      category: project.category || "Web Development",
      featured: project.featured || false
    });

    setStatus("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // DELETE PROJECT
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.projects}/${id}`,
        token
      );

      setProjects((prev) =>
        prev.filter((project) => project._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus("Project deleted successfully.");
    } catch (error) {
      console.error("Failed to delete project:", error);

      setError(
        error.message || "Failed to delete project."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* =========================
            PAGE HEADER
        ========================= */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Portfolio Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Projects
          </h1>

          <p className="text-gray-500 mt-2">
            Add, edit and manage the projects displayed
            on your portfolio.
          </p>
        </div>

        {/* =========================
            STATUS MESSAGE
        ========================= */}
        {status && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
            {status}
          </div>
        )}

        {/* =========================
            ERROR MESSAGE
        ========================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            PROJECT FORM
        ========================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
            <div>
              <h2 className="text-xl font-semibold">
                {editingId
                  ? "Edit Project"
                  : "Add New Project"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected project."
                  : "Add a project to your portfolio."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-black transition"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            {/* TITLE + CATEGORY */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Atelier Furniture"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="Web Development"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />
              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the project..."
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
              />
            </div>

            {/* IMAGE */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/project-image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

              <p className="text-xs text-gray-500 mt-2">
                Leave empty if you don't want to display a project image.
              </p>
            </div>

            {/* TECHNOLOGIES */}
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2">
                Technologies
              </label>

              <input
                type="text"
                name="technologies"
                value={form.technologies}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate technologies using commas.
              </p>
            </div>

            {/* LINKS */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub URL
                </label>

                <input
                  type="url"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Live Demo URL
                </label>

                <input
                  type="url"
                  name="liveLink"
                  value={form.liveLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />
              </div>

            </div>

            {/* FEATURED */}
            <div className="mt-6">
              <label className="inline-flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                  className="w-4 h-4"
                />

                <span className="text-sm font-medium">
                  Featured Project
                </span>
              </label>
            </div>

            {/* BUTTON */}
            <div className="mt-7 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Project"
                  : "Add Project"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:border-black transition disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>

        {/* =========================
            PROJECT LIST
        ========================= */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Your Projects
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {projects.length} project
                {projects.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-500">
                Loading projects...
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <h3 className="text-lg font-semibold">
                No projects yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first project using the form above.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">

              {projects.map((project) => (

                <article
                  key={project._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                >

                  {/* IMAGE */}
                  <div className="aspect-video bg-gray-100 overflow-hidden">

                    {project.image ? (
                      <img
                        src={
                          project.image.startsWith("http")
                            ? project.image
                            : `http://localhost:5000${project.image}`
                        }
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-6">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h3 className="text-xl font-semibold">
                          {project.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {project.category}
                        </p>
                      </div>

                      {project.featured && (
                        <span className="shrink-0 text-xs bg-black text-white px-3 py-1 rounded-full">
                          Featured
                        </span>
                      )}

                    </div>

                    <p className="text-gray-600 mt-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* TECHNOLOGIES */}
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5">

                        {project.technologies.map(
                          (technology, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 px-3 py-1.5 rounded-full"
                            >
                              {technology}
                            </span>
                          )
                        )}

                      </div>
                    )}

                    {/* LINKS */}
                    <div className="flex flex-wrap gap-4 mt-6 text-sm">

                      {project.liveLink && (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-black font-medium hover:underline"
                        >
                          Live Demo →
                        </a>
                      )}

                      {project.githubLink && (
                        <a
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-black hover:underline"
                        >
                          GitHub →
                        </a>
                      )}

                    </div>

                    {/* ACTIONS */}
                    <div className="border-t border-gray-200 mt-6 pt-5 flex gap-3">

                      <button
                        type="button"
                        onClick={() => handleEdit(project)}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:border-black transition"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(project._id)
                        }
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminProjects;
