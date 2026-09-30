import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { logout, admin } = useAuth();
  

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard"
    },
    {
      name: "Projects",
      path: "/admin/projects"
    },
    {
      name: "Skills",
      path: "/admin/skills"
    },
    {
      name: "Services",
      path: "/admin/services"
    },
    {
      name: "Experience",
      path: "/admin/experience"
    },
    {
      name: "Education",
      path: "/admin/education"
    },
    {
      name: "Certifications",
      path: "/admin/certifications"
    },
    {
      name: "Gallery",
      path: "/admin/gallery"
    },
    {
      name: "Messages",
      path: "/admin/messages"
    }
  ];

  return (
    <div className="admin-shell min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="admin-sidebar w-64 bg-black text-white min-h-screen p-6">

        {/* Brand */}
        <div className="mb-10">

          <h1 className="flex items-center gap-3 text-2xl font-bold">
            <span className="admin-mark">CF</span>
            COSMIC FLAIR
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            {admin?.username || "Admin"}
          </p>

        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-black"
                    : "text-gray-300 hover:bg-gray-800"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}

        </nav>

      </aside>

      {/* Main Area */}
      <div className="flex-1">

        {/* Top Header */}
        <header className="h-20 bg-white border-b flex items-center justify-between px-8">

          <h2 className="text-xl font-semibold">
            Portfolio control room
          </h2>

          <button
            onClick={handleLogout}
            className="admin-logout px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>

        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;
