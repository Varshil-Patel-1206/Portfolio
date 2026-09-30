import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function Gallery() {
  const [gallery, setGallery] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await api.get(endpoints.gallery);
        setGallery(data);
      } catch (error) {
        console.error("Failed to load gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(gallery.map((item) => item.category).filter(Boolean))
    ];

    return ["All", ...uniqueCategories];
  }, [gallery]);

  const filteredGallery =
    activeCategory === "All"
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  const sortedGallery = [...filteredGallery].sort(
    (a, b) => {
      if (a.featured !== b.featured) {
        return Number(b.featured) - Number(a.featured);
      }

      return (a.order || 0) - (b.order || 0);
    }
  );

  return (
    <section id="gallery" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 border-b border-gray-200 pb-12">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              Design Gallery
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Visual
              <br />
              experiments.
            </h2>
          </div>

          <div className="lg:pt-10">
            <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
              A collection of graphic design, branding, UI/UX and visual
              experiments created while exploring different ideas and styles.
            </p>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading gallery...
          </div>
        )}

        {/* EMPTY */}
        {!loading && gallery.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No design work available yet.
          </div>
        )}

        {!loading && gallery.length > 0 && (
          <>
            {/* CATEGORY FILTER */}
            <div className="mt-10 flex flex-wrap gap-2">

              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm transition ${
                    activeCategory === category
                      ? "bg-black text-white"
                      : "border border-gray-200 text-gray-500 hover:border-black hover:text-black"
                  }`}
                >
                  {category}
                </button>
              ))}

            </div>

            {/* GALLERY GRID */}
            {sortedGallery.length === 0 ? (
              <div className="py-20 text-center text-gray-500">
                No work found in this category.
              </div>
            ) : (
              <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-6">

                {sortedGallery.map((item, index) => (
                  <article
                    key={item._id}
                    className="group mb-6 break-inside-avoid"
                  >

                    {/* IMAGE */}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100">

                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="aspect-square flex items-center justify-center">
                          <span className="text-gray-400 text-sm">
                            No Preview
                          </span>
                        </div>
                      )}

                      {/* FEATURED */}
                      {item.featured && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 bg-black text-white rounded-full text-xs">
                          Featured
                        </span>
                      )}

                    </div>

                    {/* DETAILS */}
                    <div className="pt-4 px-1">

                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-400">
                            {item.category}
                          </p>

                          <h3 className="mt-1 text-lg font-semibold">
                            {item.title}
                          </h3>
                        </div>

                        <span className="text-xs text-gray-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                      </div>

                      {item.description && (
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* TOOLS */}
                      {item.tools?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">

                          {item.tools.map((tool) => (
                            <span
                              key={tool}
                              className="text-xs text-gray-400"
                            >
                              #{tool}
                            </span>
                          ))}

                        </div>
                      )}

                    </div>

                  </article>
                ))}

              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
}

export default Gallery;