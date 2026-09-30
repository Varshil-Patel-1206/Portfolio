import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Work", href: "#projects" },
    { name: "Services", href: "#services" },
    { name: "Experience", href: "#experience" },
    { name: "Certifications", href: "#certifications" },
    { name: "Gallery", href: "#gallery" }
  ];

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 pt-5">

        <div className="h-16 px-5 lg:px-6 bg-white/75 backdrop-blur-xl border border-gray-200 rounded-2xl flex items-center justify-between shadow-sm">

          {/* LOGO */}
          <a
            href="#home"
            onClick={closeMenu}
            className="flex items-center gap-3 text-lg font-bold tracking-tight"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f05d45] text-sm text-white">
              CF
            </span>
            <span>COSMIC FLAIR</span>
          </a>

          {/* DESKTOP NAV */}
          <div className="hidden xl:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-gray-500 hover:text-black transition"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* DESKTOP CTA */}
          <a
            href="#contact"
            className="hidden lg:block bg-black text-white px-5 py-2.5 rounded-xl text-sm hover:bg-gray-800 transition"
          >
            Let's Talk <span aria-hidden="true">↗</span>
          </a>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition text-xl"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
          >
            {isOpen ? "×" : "☰"}
          </button>

        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="lg:hidden mt-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-lg">

            <div className="flex flex-col">

              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={closeMenu}
                  className="py-3 text-gray-600 hover:text-black border-b border-gray-100 last:border-0 transition"
                >
                  {item.name}
                </a>
              ))}

              <a
                href="#contact"
                onClick={closeMenu}
                className="mt-4 bg-black text-white px-5 py-3 rounded-xl text-center text-sm"
              >
                Let's Talk
              </a>

            </div>

          </div>
        )}

      </nav>
    </header>
  );
}

export default Navbar;