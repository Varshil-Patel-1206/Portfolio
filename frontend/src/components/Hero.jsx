function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-28 pb-10"
    >
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-8">

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-12 lg:gap-20 items-end">

          {/* LEFT */}
          <div>

            <p className="flex items-center gap-3 text-sm uppercase tracking-[0.3em] text-gray-500 mb-7">
              <span className="h-2 w-2 rounded-full bg-[#f05d45]" />
              Full-Stack Developer / Designer
            </p>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] font-bold tracking-[-0.05em] leading-[0.88]">
              I build
              <br />
              <span className="text-[#f05d45]">digital</span>
              <br />
              experiences.
            </h1>

            <p className="mt-10 max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed">
              I'm Varshil Patel — a Full-Stack Developer,
              UI/UX Designer and Graphic Designer creating
              digital experiences that combine technology,
              functionality and visual design.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">

              <a
                href="#projects"
                className="px-7 py-3.5 bg-black text-white rounded-full hover:bg-gray-800 transition"
              >
                View My Work <span aria-hidden="true">↗</span>
              </a>

              <a
                href="#contact"
                className="px-7 py-3.5 border border-gray-300 rounded-full hover:border-black transition"
              >
                Let's Talk
              </a>

            </div>

          </div>

          {/* RIGHT */}
          <div className="hidden lg:flex justify-end pb-2">

            <div className="relative max-w-xs border-l border-[#172226]/20 pl-8">

              <div className="absolute -left-7 -top-8 h-20 w-20 rounded-full bg-[#d9f36b] opacity-80" />

              <div className="relative w-16 h-1 bg-[#f05d45] mb-6" />

              <p className="text-sm text-gray-500 leading-relaxed">
                Based in Gujarat, India.
                <br />
                Available for creative projects,
                web development and design work.
              </p>

              <div className="mt-8 space-y-2 text-sm">

                <p>
                  <span className="text-gray-400">
                    Focus
                  </span>{" "}
                  Web • UI/UX • Graphic Design
                </p>

                <p>
                  <span className="text-gray-400">
                    Stack
                  </span>{" "}
                  React • Node • MongoDB
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* BOTTOM INFO */}
        <div className="mt-24 lg:mt-32 border-t border-gray-200 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">

          <p>
            Scroll to explore <span className="ml-2 text-[#f05d45]">↓</span>
          </p>

          <p>
            © {new Date().getFullYear()} COSMIC FLAIR
          </p>

        </div>

      </div>
    </section>
  );
}

export default Hero;