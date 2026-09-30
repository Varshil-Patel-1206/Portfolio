import { useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const data = await api.get(endpoints.certifications);
        setCertifications(data);
      } catch (error) {
        console.error("Failed to load certifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  const sortedCertifications = [...certifications].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <section id="certifications" className="py-28 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-gray-200 pb-10">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              Certifications
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Learning
              <br />
              in progress.
            </h2>
          </div>

          <p className="max-w-md text-gray-500 leading-relaxed">
            Certifications and learning milestones that represent my
            continuous growth across technology and design.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading certifications...
          </div>
        )}

        {/* EMPTY */}
        {!loading && sortedCertifications.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No certifications available yet.
          </div>
        )}

        {/* CERTIFICATIONS */}
        {!loading && sortedCertifications.length > 0 && (
          <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {sortedCertifications.map((certificate, index) => (
              <article
                key={certificate._id}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-400 transition"
              >

                {/* CERTIFICATE IMAGE */}
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">

                  {certificate.certificateImage ? (
                    <img
                      src={getImageUrl(certificate.certificateImage)}
                      alt={certificate.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-3xl font-semibold text-gray-300">
                          {String(index + 1).padStart(2, "0")}
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                          Certificate
                        </p>
                      </div>
                    </div>
                  )}

                </div>

                {/* CONTENT */}
                <div className="p-6">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-400">
                        {certificate.organization}
                      </p>

                      <h3 className="mt-2 text-xl font-semibold leading-snug">
                        {certificate.title}
                      </h3>
                    </div>

                    <span className="text-xs text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                  </div>

                  <div className="mt-5 space-y-2 text-sm text-gray-500">

                    <p>
                      <span className="text-gray-400">
                        Issued:
                      </span>{" "}
                      {certificate.issueDate}
                    </p>

                    {certificate.credentialId && (
                      <p className="break-all">
                        <span className="text-gray-400">
                          Credential:
                        </span>{" "}
                        {certificate.credentialId}
                      </p>
                    )}

                  </div>

                  {/* VERIFY */}
                  {certificate.credentialUrl && (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex mt-6 px-4 py-2.5 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition"
                    >
                      Verify Credential ↗
                    </a>
                  )}

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}

export default Certifications;