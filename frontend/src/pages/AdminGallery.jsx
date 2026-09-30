import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

const initialForm = {
  title: "",
  description: "",
  category: "Graphic Design",
  tools: "",
  featured: false,
  order: 0
};

function AdminGallery() {
  const { token } = useAuth();

  const [gallery, setGallery] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD GALLERY
  // =========================
  const loadGallery = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.gallery,
        token
      );

      setGallery(data);
    } catch (error) {
      console.error(
        "Failed to load gallery:",
        error
      );

      setError(
        error.message || "Failed to load gallery."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadGallery();
    }
  }, [token, loadGallery]);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  };

  // =========================
  // HANDLE IMAGE
  // =========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setPreview("");
    setEditingId(null);

    const fileInput =
      document.getElementById("gallery-image");

    if (fileInput) {
      fileInput.value = "";
    }
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
      if (!editingId && !image) {
        setError(
          "Please select an image for the gallery item."
        );
        setSaving(false);
        return;
      }

      const formData = new FormData();

      formData.append(
        "title",
        form.title.trim()
      );

      formData.append(
        "description",
        form.description.trim()
      );

      formData.append(
        "category",
        form.category.trim()
      );

      formData.append(
        "tools",
        JSON.stringify(
          form.tools
            .split(",")
            .map((tool) => tool.trim())
            .filter(Boolean)
        )
      );

      formData.append(
        "featured",
        String(form.featured)
      );

      formData.append(
        "order",
        String(Number(form.order) || 0)
      );

      if (image) {
        formData.append("image", image);
      }

      if (editingId) {
        await api.put(
          `${endpoints.gallery}/${editingId}`,
          formData,
          token
        );

        setStatus(
          "Gallery item updated successfully."
        );
      } else {
        await api.post(
          endpoints.gallery,
          formData,
          token
        );

        setStatus(
          "Gallery item added successfully."
        );
      }

      resetForm();
      await loadGallery();
    } catch (error) {
      console.error(
        "Failed to save gallery item:",
        error
      );

      setError(
        error.message ||
          "Failed to save gallery item."
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
      title: item.title || "",
      description: item.description || "",
      category: item.category || "Graphic Design",
      tools: item.tools?.join(", ") || "",
      featured: item.featured || false,
      order: item.order ?? 0
    });

    setImage(null);

    setPreview(
      item.image
        ? item.image.startsWith("http")
          ? item.image
          : `http://localhost:5000${item.image}`
        : ""
    );

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
      "Are you sure you want to delete this gallery item?"
    );

    if (!confirmed) return;

    try {
      setStatus("");
      setError("");

      await api.delete(
        `${endpoints.gallery}/${id}`,
        token
      );

      setGallery((prev) =>
        prev.filter((item) => item._id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setStatus(
        "Gallery item deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete gallery item:",
        error
      );

      setError(
        error.message ||
          "Failed to delete gallery item."
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
            Design Gallery
          </h1>

          <p className="text-gray-500 mt-2">
            Upload and manage your graphic design,
            branding, poster and visual work.
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
                  ? "Edit Gallery Item"
                  : "Add Design"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update the selected design."
                  : "Upload a new design to your gallery."}
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
                  Design Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Brand Identity Concept"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
                />

              </div>

              <div>

                <label className="block text-sm font-medium mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black bg-white"
                >
                  <option value="Graphic Design">
                    Graphic Design
                  </option>

                  <option value="Branding">
                    Branding
                  </option>

                  <option value="Logo Design">
                    Logo Design
                  </option>

                  <option value="Poster Design">
                    Poster Design
                  </option>

                  <option value="Social Media">
                    Social Media
                  </option>

                  <option value="UI/UX">
                    UI/UX
                  </option>

                  <option value="Illustration">
                    Illustration
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>

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
                placeholder="Describe this design..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black resize-none"
              />

            </div>

            {/* TOOLS */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Tools
              </label>

              <input
                type="text"
                name="tools"
                value={form.tools}
                onChange={handleChange}
                placeholder="Canva, Photoshop, Figma"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-black"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate tools using commas.
              </p>

            </div>

            {/* IMAGE */}
            <div className="mt-5">

              <label className="block text-sm font-medium mb-2">
                Design Image
              </label>

              <input
                id="gallery-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none"
              />

              <p className="text-xs text-gray-500 mt-2">
                JPG, JPEG, PNG or WEBP. Maximum size: 5 MB.
              </p>

            </div>

            {/* IMAGE PREVIEW */}
            {preview && (
              <div className="mt-5">

                <p className="text-sm font-medium mb-2">
                  Preview
                </p>

                <div className="max-w-md aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-gray-100">

                  <img
                    src={preview}
                    alt="Gallery preview"
                    className="w-full h-full object-contain"
                  />

                </div>

              </div>
            )}

            {/* FEATURED + ORDER */}
            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div className="flex items-center">

                <label className="inline-flex items-center gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />

                  <span className="text-sm font-medium">
                    Featured Design
                  </span>

                </label>

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
                  ? "Uploading..."
                  : editingId
                  ? "Update Design"
                  : "Upload Design"}
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
            GALLERY LIST
        ========================= */}
        <div>

          <div className="mb-6">

            <h2 className="text-2xl font-semibold">
              Your Designs
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {gallery.length} design
              {gallery.length !== 1 ? "s" : ""}
            </p>

          </div>

          {/* LOADING */}
          {loading ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <p className="text-gray-500">
                Loading gallery...
              </p>

            </div>

          ) : gallery.length === 0 ? (

            /* EMPTY */
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

              <h3 className="text-lg font-semibold">
                No designs yet
              </h3>

              <p className="text-gray-500 mt-2">
                Upload your first design using
                the form above.
              </p>

            </div>

          ) : (

            /* LIST */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {gallery.map((item) => {

                const imageUrl =
                  item.image?.startsWith("http")
                    ? item.image
                    : `http://localhost:5000${item.image}`;

                return (
                  <article
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                  >

                    {/* IMAGE */}
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">

                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />

                    </div>

                    {/* CONTENT */}
                    <div className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <h3 className="text-lg font-semibold">
                            {item.title}
                          </h3>

                          <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">
                            {item.category}
                          </p>

                        </div>

                        {item.featured && (
                          <span className="text-xs bg-black text-white px-2.5 py-1 rounded-full whitespace-nowrap">
                            Featured
                          </span>
                        )}

                      </div>

                      {item.description && (
                        <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                          {item.description}
                        </p>
                      )}

                      {/* TOOLS */}
                      {item.tools?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">

                          {item.tools.map(
                            (tool, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-100 px-2.5 py-1 rounded-full"
                              >
                                {tool}
                              </span>
                            )
                          )}

                        </div>
                      )}

                      {/* ACTIONS */}
                      <div className="border-t border-gray-200 mt-5 pt-4 flex items-center justify-between">

                        <span className="text-xs text-gray-400">
                          Order: {item.order}
                        </span>

                        <div className="flex gap-4">

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
                              handleDelete(
                                item._id
                              )
                            }
                            className="text-sm text-red-600 hover:underline"
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
}

export default AdminGallery;
