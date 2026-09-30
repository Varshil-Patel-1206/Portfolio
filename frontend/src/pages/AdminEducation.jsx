import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  degree: "",
  institution: "",
  location: "",
  startYear: "",
  endYear: "Present",
  description: "",
  order: 0
};

function AdminEducation() {
  const { token } = useAuth();

  const [education, setEducation] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD EDUCATION
  // =========================
  const loadEducation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.education,
        token
      );

      setEducation(data);
    } catch (error) {
      console.error(
        "Failed to load education:",
        error
      );

      setError(
        error.message ||
          "Failed to load education."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadEducation();
    }
  }, [token, loadEducation]);

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
      const educationData = {
        degree: form.degree.trim(),
        institution: form.institution.trim(),
        location: form.location.trim(),
        startYear: form.startYear.trim(),
        endYear: form.endYear.trim() || "Present",
        description: form.description.trim(),
        order: Number(form.order) || 0
      };

      if (editingId) {
        await api.put(
          `${endpoints.education}/${editingId}`,
          educationData,
          token
        );

        setStatus(
          "Education updated successfully."
        );
      } else {
        await api.post(
          endpoints.education,
          educationData,
          token
        );

        setStatus(
          "Education added successfully."
        );
      }

      resetForm();
      await loadEducation();
    } catch (error) {
      console.error(
        "Failed to save education:",
        error
      );

      setError(
        error.message ||
          "Failed to save education."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      degree: item.degree || "",
      institution: item.institution || "",
      location: item.location || "",
      startYear: item.startYear || "",
      endYear: item.endYear || "Present",
      description: item.description || "",
      order: item.order ?? 0
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
      "Are you sure you want to delete this education entry?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.education}/${id}`,
        token
      );

      setEducation((prev) =>
        prev.filter((item) => item._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus(
        "Education deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete education:",
        error
      );

      setError(
        error.message ||
          "Failed to delete education."
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
            Education
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your academic qualifications and
            educational background.
          </p>

        </div>

        {/* =========================
            SUCCESS MESSAGE
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
            FORM
        ========================= */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

            <div>

              <h2 className="text-xl font-semibold">
                {editingId
                  ? "Edit Education"
                  : "Add Education"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected education entry."
                  : "Add your educational qualification."}
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

            {/* DEGREE + INSTITUTION */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Degree / Qualification
                </label>

                <input
                  type="text"
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech in Computer Science"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Institution
                </label>

                <input
                  type="text"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="e.g. CHARUSAT"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

            </div>

            {/* LOCATION */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Gujarat, India"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

            </div>

            {/* YEARS */}
            <div className="grid md:grid-cols-3 gap-5 mt-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Start Year
                </label>

                <input
                  type="text"
                  name="startYear"
                  value={form.startYear}
                  onChange={handleChange}
                  placeholder="e.g. 2024"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  End Year
                </label>

                <input
                  type="text"
                  name="endYear"
                  value={form.endYear}
                  onChange={handleChange}
                  placeholder="e.g. 2028 or Present"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

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

            {/* DESCRIPTION */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Add a short description about your education..."
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
              />

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
                  ? "Update Education"
                  : "Add Education"}
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
            EDUCATION LIST
        ========================= */}
        <div>

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Your Education
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {education.length} education{" "}
              {education.length !== 1
                ? "entries"
                : "entry"}
            </p>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <p className="text-gray-500">
                Loading education...
              </p>

            </div>

          ) : education.length === 0 ? (

            /* EMPTY */
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <h3 className="text-lg font-semibold">
                No education entries yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your educational qualification
                using the form above.
              </p>

            </div>

          ) : (

            /* LIST */
            <div className="space-y-5">

              {education.map((item) => (

                <article
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 md:p-7"
                >

                  {/* TOP */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div>

                      <p className="text-sm text-gray-500">
                        {item.startYear} —{" "}
                        {item.endYear}
                      </p>

                      <h3 className="text-xl font-semibold mt-2">
                        {item.degree}
                      </h3>

                      <p className="text-gray-700 mt-1">
                        {item.institution}
                      </p>

                      {item.location && (
                        <p className="text-sm text-gray-500 mt-1">
                          {item.location}
                        </p>
                      )}

                    </div>

                    <span className="text-xs text-gray-400">
                      Order: {item.order}
                    </span>

                  </div>

                  {/* DESCRIPTION */}
                  {item.description && (
                    <p className="text-gray-600 mt-5 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {/* ACTIONS */}
                  <div className="border-t border-gray-200 mt-6 pt-5 flex gap-4">

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(item)
                      }
                      className="text-sm font-medium hover:underline"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(item._id)
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

export default AdminEducation;
