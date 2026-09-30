import { useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.get(endpoints.services);
        setServices(data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section id="services" className="py-28 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 border-b border-gray-200 pb-12">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              Services
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              What I
              <br />
              can do.
            </h2>
          </div>

          <div className="lg:pt-10">
            <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
              From developing complete web applications to creating visual
              identities, I help turn ideas into useful and engaging digital
              experiences.
            </p>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading services...
          </div>
        )}

        {/* EMPTY */}
        {!loading && services.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No services available yet.
          </div>
        )}

        {/* SERVICES */}
        {!loading && services.length > 0 && (
          <div className="mt-14">

            {services
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((service, index) => (
                <article
                  key={service._id}
                  className="group grid lg:grid-cols-[80px_0.8fr_1fr] gap-8 lg:gap-12 py-10 border-b border-gray-200"
                >

                  {/* NUMBER */}
                  <div>
                    <span className="text-sm text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* TITLE */}
                  <div>

                    <div className="flex items-center gap-4">

                      {service.icon && (
                        <span className="text-2xl">
                          {service.icon}
                        </span>
                      )}

                      <h3 className="text-2xl md:text-3xl font-semibold tracking-tight group-hover:translate-x-1 transition-transform">
                        {service.title}
                      </h3>

                    </div>

                  </div>

                  {/* DESCRIPTION + FEATURES */}
                  <div>

                    <p className="text-gray-600 leading-relaxed max-w-xl">
                      {service.description}
                    </p>

                    {service.features?.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">

                        {service.features.map((feature) => (
                          <span
                            key={feature}
                            className="text-sm text-gray-500 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                            {feature}
                          </span>
                        ))}

                      </div>
                    )}

                  </div>

                </article>
              ))}

          </div>
        )}

        {/* CTA */}
        <div className="mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          <p className="text-gray-500">
            Have a project in mind?
          </p>

          <a
            href="#contact"
            className="inline-flex w-fit px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition"
          >
            Let's work together ↗
          </a>

        </div>

      </div>
    </section>
  );
}

export default Services;