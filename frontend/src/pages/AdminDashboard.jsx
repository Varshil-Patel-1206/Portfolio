import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { admin, token } = useAuth();

  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    services: 0,
    experience: 0,
    education: 0,
    certifications: 0,
    gallery: 0,
    messages: 0,
    unreadMessages: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          projects,
          skills,
          services,
          experience,
          education,
          certifications,
          gallery,
          messages
        ] = await Promise.all([
          api.get(endpoints.projects),
          api.get(endpoints.skills),
          api.get(endpoints.services),
          api.get(endpoints.experience),
          api.get(endpoints.education),
          api.get(endpoints.certifications),
          api.get(endpoints.gallery),
          api.get(endpoints.messages, token)
        ]);

        setStats({
          projects: projects.length,
          skills: skills.length,
          services: services.length,
          experience: experience.length,
          education: education.length,
          certifications: certifications.length,
          gallery: gallery.length,
          messages: messages.length,
          unreadMessages: messages.filter(
            (message) => !message.isRead
          ).length
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      loadDashboard();
    }
  }, [token]);

  const cards = [
    {
      title: "Projects",
      value: stats.projects
    },
    {
      title: "Skills",
      value: stats.skills
    },
    {
      title: "Services",
      value: stats.services
    },
    {
      title: "Experience",
      value: stats.experience
    },
    {
      title: "Education",
      value: stats.education
    },
    {
      title: "Certifications",
      value: stats.certifications
    },
    {
      title: "Gallery",
      value: stats.gallery
    },
    {
      title: "Messages",
      value: stats.messages
    }
  ];

  return (
    <AdminLayout>
      <div>

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm text-gray-500">
            Welcome back
          </p>

          <h1 className="text-3xl font-bold mt-1">
            {admin?.username || "Admin"}
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your portfolio content from here.
          </p>
        </div>

        {/* Stats */}
        {loading ? (
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="admin-stat bg-white border border-gray-200 rounded-2xl p-6"
                >
                  <p className="text-sm text-gray-500">
                    {card.title}
                  </p>

                  <p className="text-4xl font-bold mt-3">
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Messages Alert */}
            <div className="admin-message-card mt-8 bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-xl font-semibold">
                    Messages
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {stats.unreadMessages === 0
                      ? "You have no unread messages."
                      : `You have ${stats.unreadMessages} unread message${
                          stats.unreadMessages > 1
                            ? "s"
                            : ""
                        }.`}
                  </p>
                </div>

                <a
                  href="/admin/messages"
                  className="admin-primary inline-block bg-black text-white px-5 py-2.5 rounded-lg text-sm hover:bg-gray-800 transition"
                >
                  View Messages
                </a>

              </div>
            </div>
          </>
        )}

      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
