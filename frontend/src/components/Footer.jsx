function Footer() {
  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Work", href: "#projects" },
    { name: "Services", href: "#services" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" }
  ];

  return (
    <footer className="bg-black text-white px-6 lg:px-8">

      <div className="max-w-7xl mx-auto">

        {/* MAIN FOOTER */}
        <div className="py-20 border-b border-white/10">

          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">

            {/* BRAND */}
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-gray-500 mb-6">
                Portfolio
              </p>

              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                COSMIC FLAIR
              </h2>

              <p className="mt-5 max-w-lg text-gray-400 leading-relaxed">
                Full-Stack Developer • UI/UX Designer • Graphic Designer •
                Problem Solver
              </p>
            </div>

            {/* NAVIGATION */}
            <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-x-10 gap-y-4">

              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-400 hover:text-white transition"
                >
                  {item.name}
                </a>
              ))}

            </nav>

          </div>

        </div>

        {/* BOTTOM */}
        <div className="py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} COSMIC FLAIR. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-5">

            <a
              href="https://github.com/Varshil-Patel-1206"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition"
            >
              GitHub ↗
            </a>

            <a
              href="https://www.linkedin.com/in/varshil-patel-a197b5331"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition"
            >
              LinkedIn ↗
            </a>

            <a
              href="https://www.instagram.com/cosmic.flair.3/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-white transition"
            >
              Instagram ↗
            </a>

            <a
              href="#home"
              className="text-sm text-gray-500 hover:text-white transition"
            >
              Back to top ↑
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;