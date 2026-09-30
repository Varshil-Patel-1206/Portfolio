import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  icon: "",
  features: "",
  order: 0
};

function AdminServices() {
  const { token } = useAuth();

  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD SERVICES
  // =========================
  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.services,
        token
      );

      setServices(data);
    } catch (error) {
      console.error(
        "Failed to load services:",
        error
      );

      setError(
        error.message || "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadServices();
    }
  }, [token, loadServices]);

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
      const serviceData = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon.trim(),

        features: form.features
          .split(",")
          .map((feature) => feature.trim())
          .filter(Boolean),

        order: Number(form.order) || 0
      };

      if (editingId) {
        await api.put(
          `${endpoints.services}/${editingId}`,
          serviceData,
          token
        );

        setStatus(
          "Service updated successfully."
        );
      } else {
        await api.post(
          endpoints.services,
          serviceData,
          token
        );

        setStatus(
          "Service added successfully."
        );
      }

      resetForm();
      await loadServices();
    } catch (error) {
      console.error(
        "Failed to save service:",
        error
      );

      setError(
        error.message || "Failed to save service."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (service) => {
    setEditingId(service._id);

    setForm({
      title: service.title || "",
      description: service.description || "",
      icon: service.icon || "",
      features:
        service.features?.join(", ") || "",
      order: service.order ?? 0
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
      "Are you sure you want to delete this service?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.services}/${id}`,
        token
      );

      setServices((prev) =>
        prev.filter(
          (service) => service._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus(
        "Service deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete service:",
        error
      );

      setError(
        error.message || "Failed to delete service."
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
            Services
          </h1>

          <p className="text-gray-500 mt-2">
            Manage the services displayed on your
            portfolio.
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
                  ? "Edit Service"
                  : "Add New Service"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected service."
                  : "Add a service to your portfolio."}
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

            {/* TITLE + ICON */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Service Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Web Development"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />
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
                  placeholder="e.g. 💻"
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
                placeholder="Describe what this service includes..."
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
              />

            </div>

            {/* FEATURES */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Features
              </label>

              <input
                type="text"
                name="features"
                value={form.features}
                onChange={handleChange}
                placeholder="Responsive Design, API Integration, Deployment"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate features using commas.
              </p>

            </div>

            {/* ORDER */}
            <div className="mt-5 max-w-xs">

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
                  ? "Update Service"
                  : "Add Service"}
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
            SERVICE LIST
        ========================= */}
        <div>

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-2xl font-semibold">
                Your Services
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {services.length} service
                {services.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-500">
                Loading services...
              </p>
            </div>

          ) : services.length === 0 ? (

            /* EMPTY */
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <h3 className="text-lg font-semibold">
                No services yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first service using the
                form above.
              </p>

            </div>

          ) : (

            /* LIST */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {services.map((service, index) => (

                <article
                  key={service._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6"
                >

                  {/* TOP */}
                  <div className="flex items-start justify-between">

                    <span className="text-sm text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {service.icon && (
                      <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                        {service.icon}
                      </div>
                    )}

                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-semibold mt-8">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {service.description}
                  </p>

                  {/* FEATURES */}
                  {service.features?.length > 0 && (
                    <ul className="mt-5 space-y-2">

                      {service.features.map(
                        (feature, featureIndex) => (
                          <li
                            key={featureIndex}
                            className="text-sm text-gray-600 flex gap-2"
                          >
                            <span>—</span>
                            <span>{feature}</span>
                          </li>
                        )
                      )}

                    </ul>
                  )}

                  {/* FOOTER */}
                  <div className="border-t border-gray-200 mt-6 pt-5 flex items-center justify-between">

                    <span className="text-xs text-gray-400">
                      Order: {service.order}
                    </span>

                    <div className="flex gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(service)
                        }
                        className="text-sm font-medium hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(service._id)
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

export default AdminServices;
