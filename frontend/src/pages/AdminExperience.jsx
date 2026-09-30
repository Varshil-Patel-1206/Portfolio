import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  role: "",
  company: "",
  type: "Internship",
  description: "",
  technologies: "",
  startDate: "",
  endDate: "Present",
  order: 0
};

function AdminExperience() {
  const { token } = useAuth();

  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD EXPERIENCE
  // =========================
  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.experience,
        token
      );

      setExperiences(data);
    } catch (error) {
      console.error(
        "Failed to load experience:",
        error
      );

      setError(
        error.message ||
          "Failed to load experience."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadExperiences();
    }
  }, [token, loadExperiences]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
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
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const experienceData = {
        role: form.role.trim(),
        company: form.company.trim(),
        type: form.type.trim(),
        description: form.description.trim(),

        technologies: form.technologies
          .split(",")
          .map((technology) => technology.trim())
          .filter(Boolean),

        startDate: form.startDate.trim(),
        endDate: form.endDate.trim() || "Present",

        order: Number(form.order) || 0
      };

      if (editingId) {
        await api.put(
          `${endpoints.experience}/${editingId}`,
          experienceData,
          token
        );

        setStatus(
          "Experience updated successfully."
        );
      } else {
        await api.post(
          endpoints.experience,
          experienceData,
          token
        );

        setStatus(
          "Experience added successfully."
        );
      }

      resetForm();
      await loadExperiences();
    } catch (error) {
      console.error(
        "Failed to save experience:",
        error
      );

      setError(
        error.message ||
          "Failed to save experience."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (experience) => {
    setEditingId(experience._id);

    setForm({
      role: experience.role || "",
      company: experience.company || "",
      type: experience.type || "Internship",
      description: experience.description || "",

      technologies:
        experience.technologies?.join(", ") || "",

      startDate: experience.startDate || "",
      endDate: experience.endDate || "Present",

      order: experience.order ?? 0
    });

    setStatus("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this experience?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.experience}/${id}`,
        token
      );

      setExperiences((prev) =>
        prev.filter(
          (experience) =>
            experience._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus(
        "Experience deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete experience:",
        error
      );

      setError(
        error.message ||
          "Failed to delete experience."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-8">

          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Portfolio Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Experience
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your internships, work experience
            and professional journey.
          </p>

        </div>

        {/* =========================
            SUCCESS
        ========================= */}
        {status && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
            {status}
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            FORM
        ========================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

            <div>

              <h2 className="text-xl font-semibold">
                {editingId
                  ? "Edit Experience"
                  : "Add Experience"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected experience."
                  : "Add an internship or work experience."}
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

            {/* ROLE + COMPANY */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Role
                </label>

                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. Web Development Intern"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Company
                </label>

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="e.g. InternPe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

            </div>

            {/* TYPE + ORDER */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Experience Type
                </label>

                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black bg-white"
                >
                  <option value="Internship">
                    Internship
                  </option>

                  <option value="Full-time">
                    Full-time
                  </option>

                  <option value="Part-time">
                    Part-time
                  </option>

                  <option value="Freelance">
                    Freelance
                  </option>

                  <option value="Contract">
                    Contract
                  </option>

                  <option value="Project">
                    Project
                  </option>
                </select>

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Display Order
                </label>

                <input
                  type="number"
                  name="order"
                  value={form.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

            </div>

            {/* DATES */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Start Date
                </label>

                <input
                  type="text"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  placeholder="e.g. June 2026"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  End Date
                </label>

                <input
                  type="text"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  placeholder="e.g. August 2026 or Present"
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
                placeholder="Describe your responsibilities and work..."
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
              />

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
                placeholder="HTML, CSS, JavaScript"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate technologies using commas.
              </p>

            </div>

            {/* BUTTONS */}
            <div className="mt-7 flex flex-wrap gap-3">

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Experience"
                  : "Add Experience"}
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
            EXPERIENCE LIST
        ========================= */}
        <div>

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-2xl font-semibold">
                Your Experience
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {experiences.length} experience
                {experiences.length !== 1
                  ? "s"
                  : ""}
              </p>

            </div>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <p className="text-gray-500">
                Loading experience...
              </p>

            </div>

          ) : experiences.length === 0 ? (

            /* EMPTY */
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <h3 className="text-lg font-semibold">
                No experience yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first experience using
                the form above.
              </p>

            </div>

          ) : (

            /* LIST */
            <div className="space-y-5">

              {experiences.map((experience) => (

                <article
                  key={experience._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7"
                >

                  {/* TOP */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <h3 className="text-xl font-semibold">
                          {experience.role}
                        </h3>

                        {experience.type && (
                          <span className="text-xs border border-gray-300 rounded-full px-3 py-1">
                            {experience.type}
                          </span>
                        )}

                      </div>

                      <p className="text-gray-700 mt-2">
                        {experience.company}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {experience.startDate} —{" "}
                        {experience.endDate}
                      </p>

                    </div>

                    <span className="text-xs text-gray-400">
                      Order: {experience.order}
                    </span>

                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 mt-5 leading-relaxed">
                    {experience.description}
                  </p>

                  {/* TECHNOLOGIES */}
                  {experience.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5">

                      {experience.technologies.map(
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

                  {/* ACTIONS */}
                  <div className="border-t border-gray-200 mt-6 pt-5 flex gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(experience)
                      }
                      className="text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          experience._id
                        )
                      }
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>

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

export default AdminExperience;
