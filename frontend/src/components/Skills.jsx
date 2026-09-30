import { useEffect, useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await api.get(endpoints.skills);
        setSkills(data);
      } catch (error) {
        console.error("Failed to load skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const groupedSkills = skills.reduce((groups, skill) => {
    const category = skill.category || "Other";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(skill);

    return groups;
  }, {});

  return (
    <section id="skills" className="py-28 px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 border-b border-gray-200 pb-12">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              Skills
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Tools I use
              <br />
              to create.
            </h2>
          </div>

          <div className="lg:pt-10">
            <p className="max-w-xl text-lg text-gray-600 leading-relaxed">
              From writing code to designing interfaces and creating visual
              content, I work across development and design to bring ideas
              to life.
            </p>
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading skills...
          </div>
        )}

        {/* EMPTY */}
        {!loading && skills.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            No skills available yet.
          </div>
        )}

        {/* SKILL GROUPS */}
        {!loading && skills.length > 0 && (
          <div className="mt-14">

            {Object.entries(groupedSkills).map(
              ([category, categorySkills], index) => (
                <div
                  key={category}
                  className={`grid lg:grid-cols-[0.35fr_1fr] gap-8 py-10 ${
                    index !== 0 ? "border-t border-gray-200" : ""
                  }`}
                >

                  {/* CATEGORY */}
                  <div>
                    <p className="text-sm text-gray-400 uppercase tracking-widest">
                      0{index + 1}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      {category}
                    </h3>
                  </div>

                  {/* SKILLS */}
                  <div className="grid sm:grid-cols-2 gap-x-10 gap-y-7">

                    {categorySkills
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((skill) => (
                        <div
                          key={skill._id}
                          className="group border-b border-gray-200 pb-5"
                        >

                          <div className="flex items-center justify-between gap-4">

                            <div className="flex items-center gap-3">

                              {skill.icon && (
                                <span className="text-lg">
                                  {skill.icon}
                                </span>
                              )}

                              <h4 className="font-medium group-hover:translate-x-1 transition-transform">
                                {skill.name}
                              </h4>

                            </div>

                            <span className="text-xs text-gray-400">
                              {skill.level}
                            </span>

                          </div>

                        </div>
                      ))}

                  </div>
                </div>
              )
            )}

          </div>
        )}

      </div>
    </section>
  );
}

export default Skills;