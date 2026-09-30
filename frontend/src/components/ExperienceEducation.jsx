import { useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function ExperienceEducation() {
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [experienceData, educationData] = await Promise.all([
          api.get(endpoints.experience),
          api.get(endpoints.education)
        ]);

        setExperience(experienceData);
        setEducation(educationData);
      } catch (error) {
        console.error("Failed to load experience and education:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedExperience = [...experience].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const sortedEducation = [...education].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  return (
    <section id="experience" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 border-b border-gray-200 pb-12">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              Experience & Education
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              The journey
              <br />
              so far.
            </h2>
          </div>

          <div className="lg:pt-10">
            <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
              A growing journey through computer science, development,
              design and practical project experience.
            </p>
          </div>

        </div>

        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading experience...
          </div>
        )}

        {!loading && (
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mt-16">

            {/* EXPERIENCE */}
            <div>

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold">
                  Experience
                </h3>

                <span className="text-sm text-gray-400">
                  {String(sortedExperience.length).padStart(2, "0")}
                </span>
              </div>

              {sortedExperience.length === 0 ? (
                <p className="text-gray-500">
                  No experience added yet.
                </p>
              ) : (
                <div className="border-t border-gray-200">

                  {sortedExperience.map((item) => (
                    <article
                      key={item._id}
                      className="py-8 border-b border-gray-200"
                    >

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">

                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-400">
                            {item.type || "Experience"}
                          </p>

                          <h4 className="mt-2 text-xl font-semibold">
                            {item.role}
                          </h4>

                          <p className="mt-1 text-gray-500">
                            {item.company}
                          </p>
                        </div>

                        <p className="text-sm text-gray-400 whitespace-nowrap">
                          {item.startDate} — {item.endDate}
                        </p>

                      </div>

                      <p className="mt-5 text-gray-600 leading-relaxed">
                        {item.description}
                      </p>

                      {item.technologies?.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="px-3 py-1.5 border border-gray-200 rounded-full text-xs text-gray-500"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>
                      )}

                    </article>
                  ))}

                </div>
              )}

            </div>

            {/* EDUCATION */}
            <div>

              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-semibold">
                  Education
                </h3>

                <span className="text-sm text-gray-400">
                  {String(sortedEducation.length).padStart(2, "0")}
                </span>
              </div>

              {sortedEducation.length === 0 ? (
                <p className="text-gray-500">
                  No education added yet.
                </p>
              ) : (
                <div className="border-t border-gray-200">

                  {sortedEducation.map((item) => (
                    <article
                      key={item._id}
                      className="py-8 border-b border-gray-200"
                    >

                      <div className="flex flex-col sm:flex-row sm:justify-between gap-2">

                        <div>
                          <p className="text-xs uppercase tracking-widest text-gray-400">
                            Education
                          </p>

                          <h4 className="mt-2 text-xl font-semibold">
                            {item.degree}
                          </h4>

                          <p className="mt-1 text-gray-500">
                            {item.institution}
                          </p>
                        </div>

                        <p className="text-sm text-gray-400 whitespace-nowrap">
                          {item.startYear} — {item.endYear}
                        </p>

                      </div>

                      {item.location && (
                        <p className="mt-4 text-sm text-gray-500">
                          {item.location}
                        </p>
                      )}

                      {item.description && (
                        <p className="mt-4 text-gray-600 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                    </article>
                  ))}

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </section>
  );
}

export default ExperienceEducation;
