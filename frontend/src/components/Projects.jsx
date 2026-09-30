import { useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get(endpoints.projects);
        setProjects(data);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000${image}`;
  };

  return (
    <section id="projects" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-gray-200 pb-10">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              Selected Work
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              Things I've
              <br />
              built.
            </h2>
          </div>

          <p className="max-w-md text-gray-500 leading-relaxed">
            A selection of projects where development, problem solving and
            visual design come together.
          </p>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading projects...
          </div>
        )}

        {/* EMPTY */}
        {!loading && projects.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No projects available yet.
          </div>
        )}

        {/* PROJECTS */}
        {!loading && projects.length > 0 && (
          <div className="mt-14 grid lg:grid-cols-2 gap-x-8 gap-y-16">

            {projects
              .sort((a, b) => Number(b.featured) - Number(a.featured))
              .map((project, index) => (
                <article
                  key={project._id}
                  className={`group ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >

                  {/* IMAGE */}
                  <div
                    className={`relative overflow-hidden bg-gray-100 rounded-2xl ${
                      index === 0
                        ? "aspect-[2/1]"
                        : "aspect-[16/10]"
                    }`}
                  >

                    {project.image ? (
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400 text-sm">
                          Project Preview
                        </span>
                      </div>
                    )}

                    {/* FEATURED */}
                    {project.featured && (
                      <span className="absolute top-5 left-5 bg-black text-white px-3 py-1.5 rounded-full text-xs">
                        Featured
                      </span>
                    )}

                    {/* VIEW LINKS */}
                    {(project.liveLink || project.githubLink) && (
                      <div className="absolute bottom-5 right-5 flex gap-2">

                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-white text-black rounded-full text-xs font-medium hover:bg-black hover:text-white transition"
                          >
                            Live ↗
                          </a>
                        )}

                        {project.githubLink && (
                          <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-black text-white rounded-full text-xs font-medium hover:bg-white hover:text-black transition"
                          >
                            GitHub ↗
                          </a>
                        )}

                      </div>
                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="mt-6">

                    <div className="flex items-start justify-between gap-6">

                      <div>
                        <p className="text-xs uppercase tracking-widest text-gray-400">
                          {project.category || "Project"}
                        </p>

                        <h3 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                          {project.title}
                        </h3>
                      </div>

                      <span className="text-sm text-gray-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                    </div>

                    <p className="mt-4 max-w-2xl text-gray-600 leading-relaxed">
                      {project.description}
                    </p>

                    {/* TECHNOLOGIES */}
                    {project.technologies?.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">

                        {project.technologies.map((technology) => (
                          <span
                            key={technology}
                            className="px-3 py-1.5 border border-gray-200 rounded-full text-xs text-gray-500"
                          >
                            {technology}
                          </span>
                        ))}

                      </div>
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

export default Projects;