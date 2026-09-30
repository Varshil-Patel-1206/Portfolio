import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  name: "",
  category: "",
  level: "Intermediate",
  icon: "",
  order: 0
};

function AdminSkills() {
  const { token } = useAuth();

  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD SKILLS
  // =========================
  const loadSkills = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.skills,
        token
      );

      setSkills(data);
    } catch (error) {
      console.error("Failed to load skills:", error);

      setError(
        error.message || "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadSkills();
    }
  }, [token, loadSkills]);

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
      const skillData = {
        name: form.name.trim(),
        category: form.category.trim(),
        level: form.level,
        icon: form.icon.trim(),
        order: Number(form.order) || 0
      };

      if (editingId) {
        await api.put(
          `${endpoints.skills}/${editingId}`,
          skillData,
          token
        );

        setStatus("Skill updated successfully.");
      } else {
        await api.post(
          endpoints.skills,
          skillData,
          token
        );

        setStatus("Skill added successfully.");
      }

      resetForm();
      await loadSkills();
    } catch (error) {
      console.error("Failed to save skill:", error);

      setError(
        error.message || "Failed to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (skill) => {
    setEditingId(skill._id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      level: skill.level || "Intermediate",
      icon: skill.icon || "",
      order: skill.order ?? 0
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
      "Are you sure you want to delete this skill?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.skills}/${id}`,
        token
      );

      setSkills((prev) =>
        prev.filter((skill) => skill._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus("Skill deleted successfully.");
    } catch (error) {
      console.error("Failed to delete skill:", error);

      setError(
        error.message || "Failed to delete skill."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Portfolio Management
          </p>

          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Skills
          </h1>

          <p className="text-gray-500 mt-2">
            Manage the technologies and skills displayed
            on your portfolio.
          </p>
        </div>

        {/* STATUS */}
        {status && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
            {status}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-10">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

            <div>
              <h2 className="text-xl font-semibold">
                {editingId
                  ? "Edit Skill"
                  : "Add New Skill"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected skill."
                  : "Add a skill to your portfolio."}
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

            {/* NAME + CATEGORY */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Skill Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. React"
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
                  placeholder="e.g. Frontend"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />
              </div>

            </div>

            {/* LEVEL + ICON + ORDER */}
            <div className="grid md:grid-cols-3 gap-5 mt-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Level
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black bg-white"
                >
                  <option value="Beginner">
                    Beginner
                  </option>

                  <option value="Intermediate">
                    Intermediate
                  </option>

                  <option value="Advanced">
                    Advanced
                  </option>

                  <option value="Expert">
                    Expert
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Icon
                </label>

                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  placeholder="e.g. ⚛️"
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
                  ? "Update Skill"
                  : "Add Skill"}
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

        {/* SKILL LIST */}
        <div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold">
                Your Skills
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {skills.length} skill
                {skills.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-500">
                Loading skills...
              </p>
            </div>
          ) : skills.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <h3 className="text-lg font-semibold">
                No skills yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first skill using the form above.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {skills.map((skill) => (

                <article
                  key={skill._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div className="flex items-center gap-4">

                      {skill.icon && (
                        <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                          {skill.icon}
                        </div>
                      )}

                      <div>
                        <h3 className="text-lg font-semibold">
                          {skill.name}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {skill.category}
                        </p>
                      </div>

                    </div>

                    <span className="text-xs border border-gray-200 rounded-full px-3 py-1 whitespace-nowrap">
                      {skill.level}
                    </span>

                  </div>

                  <div className="border-t border-gray-200 mt-5 pt-5 flex items-center justify-between">

                    <span className="text-xs text-gray-400">
                      Order: {skill.order}
                    </span>

                    <div className="flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(skill)
                        }
                        className="text-sm font-medium hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(skill._id)
                        }
                        className="text-sm text-red-600 hover:underline"
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

export default AdminSkills;
