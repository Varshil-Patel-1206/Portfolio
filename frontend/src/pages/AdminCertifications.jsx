import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  organization: "",
  issueDate: "",
  credentialId: "",
  credentialUrl: "",
  certificateImage: "",
  order: 0
};

function AdminCertifications() {
  const { token } = useAuth();

  const [certifications, setCertifications] = useState([]);
  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD CERTIFICATIONS
  // =========================
  const loadCertifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.certifications,
        token
      );

      setCertifications(data);
    } catch (error) {
      console.error(
        "Failed to load certifications:",
        error
      );

      setError(
        error.message ||
          "Failed to load certifications."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadCertifications();
    }
  }, [token, loadCertifications]);

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
      const certificationData = {
        title: form.title.trim(),
        organization: form.organization.trim(),
        issueDate: form.issueDate.trim(),
        credentialId: form.credentialId.trim(),
        credentialUrl: form.credentialUrl.trim(),
        certificateImage: form.certificateImage.trim(),
        order: Number(form.order) || 0
      };

      if (editingId) {
        await api.put(
          `${endpoints.certifications}/${editingId}`,
          certificationData,
          token
        );

        setStatus(
          "Certification updated successfully."
        );
      } else {
        await api.post(
          endpoints.certifications,
          certificationData,
          token
        );

        setStatus(
          "Certification added successfully."
        );
      }

      resetForm();
      await loadCertifications();
    } catch (error) {
      console.error(
        "Failed to save certification:",
        error
      );

      setError(
        error.message ||
          "Failed to save certification."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (certification) => {
    setEditingId(certification._id);

    setForm({
      title: certification.title || "",
      organization: certification.organization || "",
      issueDate: certification.issueDate || "",
      credentialId: certification.credentialId || "",
      credentialUrl: certification.credentialUrl || "",
      certificateImage:
        certification.certificateImage || "",
      order: certification.order ?? 0
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
      "Are you sure you want to delete this certification?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.certifications}/${id}`,
        token
      );

      setCertifications((prev) =>
        prev.filter(
          (certification) =>
            certification._id !== id
        )
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus(
        "Certification deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete certification:",
        error
      );

      setError(
        error.message ||
          "Failed to delete certification."
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
            Certifications
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your certificates, credentials and
            professional achievements.
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
                  ? "Edit Certification"
                  : "Add Certification"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected certification."
                  : "Add a certification to your portfolio."}
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

            {/* TITLE + ORGANIZATION */}
            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Certification Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. JavaScript Algorithms and Data Structures"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Organization
                </label>

                <input
                  type="text"
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  placeholder="e.g. freeCodeCamp"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

            </div>

            {/* ISSUE DATE + CREDENTIAL ID + ORDER */}
            <div className="grid md:grid-cols-3 gap-5 mt-5">

              <div>

                <label className="block text-sm font-medium mb-2">
                  Issue Date
                </label>

                <input
                  type="text"
                  name="issueDate"
                  value={form.issueDate}
                  onChange={handleChange}
                  placeholder="e.g. August 2026"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Credential ID
                </label>

                <input
                  type="text"
                  name="credentialId"
                  value={form.credentialId}
                  onChange={handleChange}
                  placeholder="Optional"
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

            {/* CREDENTIAL URL */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Credential URL
              </label>

              <input
                type="url"
                name="credentialUrl"
                value={form.credentialUrl}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

            </div>

            {/* CERTIFICATE IMAGE */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Certificate Image URL
              </label>

              <input
                type="url"
                name="certificateImage"
                value={form.certificateImage}
                onChange={handleChange}
                placeholder="https://example.com/certificate.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

              <p className="text-xs text-gray-500 mt-2">
                Add a direct image URL for the certificate.
              </p>

            </div>

            {/* IMAGE PREVIEW */}
            {form.certificateImage && (
              <div className="mt-5">

                <p className="text-sm font-medium mb-2">
                  Image Preview
                </p>

                <div className="w-full max-w-md aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">

                  <img
                    src={form.certificateImage}
                    alt="Certificate preview"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display =
                        "none";
                    }}
                  />

                </div>

              </div>
            )}

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
                  ? "Update Certification"
                  : "Add Certification"}
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
            CERTIFICATION LIST
        ========================= */}
        <div>

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Your Certifications
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {certifications.length} certification
              {certifications.length !== 1
                ? "s"
                : ""}
            </p>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <p className="text-gray-500">
                Loading certifications...
              </p>

            </div>

          ) : certifications.length === 0 ? (

            /* EMPTY */
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <h3 className="text-lg font-semibold">
                No certifications yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add your first certification using
                the form above.
              </p>

            </div>

          ) : (

            /* LIST */
            <div className="grid md:grid-cols-2 gap-6">

              {certifications.map(
                (certification) => (

                  <article
                    key={certification._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                  >

                    {/* CERTIFICATE IMAGE */}
                    {certification.certificateImage ? (
                      <div className="aspect-video bg-gray-100 overflow-hidden">

                        <img
                          src={
                            certification.certificateImage.startsWith(
                              "http"
                            )
                              ? certification.certificateImage
                              : `http://localhost:5000${certification.certificateImage}`
                          }
                          alt={
                            certification.title
                          }
                          className="w-full h-full object-contain"
                        />

                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-50 flex items-center justify-center text-gray-400">
                        No certificate image
                      </div>
                    )}

                    {/* CONTENT */}
                    <div className="p-6">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h3 className="text-xl font-semibold">
                            {certification.title}
                          </h3>

                          <p className="text-gray-700 mt-1">
                            {certification.organization}
                          </p>

                        </div>

                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          #{certification.order}
                        </span>

                      </div>

                      {/* DATE */}
                      <p className="text-sm text-gray-500 mt-4">
                        Issued:{" "}
                        {certification.issueDate}
                      </p>

                      {/* CREDENTIAL ID */}
                      {certification.credentialId && (
                        <p className="text-sm text-gray-500 mt-2 break-all">
                          Credential ID:{" "}
                          {certification.credentialId}
                        </p>
                      )}

                      {/* LINKS */}
                      <div className="flex flex-wrap gap-4 mt-5">

                        {certification.credentialUrl && (
                          <a
                            href={
                              certification.credentialUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium hover:underline"
                          >
                            View Credential →
                          </a>
                        )}

                        {certification.certificateImage && (
                          <a
                            href={
                              certification.certificateImage
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-600 hover:text-black hover:underline"
                          >
                            View Certificate →
                          </a>
                        )}

                      </div>

                      {/* ACTIONS */}
                      <div className="border-t border-gray-200 mt-6 pt-5 flex gap-4">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(
                              certification
                            )
                          }
                          className="text-sm font-medium hover:underline"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              certification._id
                            )
                          }
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminCertifications;
