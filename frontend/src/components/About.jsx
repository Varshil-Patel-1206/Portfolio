function About() {
  return (
    <section id="about" className="py-28 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* SECTION HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 border-b border-gray-200 pb-10">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-5">
              About Me
            </p>

            <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              I design.
              <br />
              I develop.
              <br />
              I solve.
            </h2>
          </div>

          <p className="max-w-md text-gray-500 leading-relaxed">
            A creative developer who combines technology, interface design
            and visual communication to turn ideas into meaningful digital
            experiences.
          </p>

        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-16 lg:gap-24 mt-16">

          {/* MAIN DESCRIPTION */}
          <div>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-800">
              I'm Varshil Patel, a Computer Science student and creative
              developer passionate about building digital products that
              are both functional and visually engaging.
            </p>

            <p className="mt-8 text-gray-600 leading-relaxed max-w-2xl">
              My work sits between development and design. I enjoy building
              full-stack web applications, designing intuitive user
              interfaces and creating graphic design work such as branding,
              posters and visual compositions.
            </p>

            <p className="mt-6 text-gray-600 leading-relaxed max-w-2xl">
              I like understanding how things work, experimenting with new
              technologies and turning rough ideas into polished,
              responsive experiences.
            </p>
          </div>

          {/* PROFILE DETAILS */}
          <div className="lg:border-l lg:border-gray-200 lg:pl-12">

            <div className="grid grid-cols-2 gap-y-10">

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Role
                </p>
                <p className="mt-2 font-medium">
                  Full-Stack Developer
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Design
                </p>
                <p className="mt-2 font-medium">
                  UI/UX + Graphic Design
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Focus
                </p>
                <p className="mt-2 font-medium">
                  Web & Digital Products
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Based
                </p>
                <p className="mt-2 font-medium">
                  Gujarat, India
                </p>
              </div>

            </div>

            {/* MINI STACK */}
            <div className="mt-14 pt-8 border-t border-gray-200">

              <p className="text-xs uppercase tracking-widest text-gray-400 mb-5">
                Working With
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "React",
                  "Next.js",
                  "Node.js",
                  "MongoDB",
                  "Tailwind",
                  "Figma",
                  "Canva",
                  "Blender"
                ].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-2 border border-gray-200 rounded-full text-sm text-gray-600"
                  >
                    {item}
                  </span>
                ))}
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default About;