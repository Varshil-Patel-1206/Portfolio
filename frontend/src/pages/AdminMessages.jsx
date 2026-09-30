import { useCallback, useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

function AdminMessages() {
  const { token } = useAuth();

  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  // =========================
  // LOAD MESSAGES
  // =========================
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api.get(
        endpoints.messages,
        token
      );

      setMessages(data);
    } catch (error) {
      console.error(
        "Failed to load messages:",
        error
      );

      setError(
        error.message || "Failed to load messages."
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadMessages();
    }
  }, [token, loadMessages]);

  // =========================
  // MARK AS READ
  // =========================
  const handleMarkAsRead = async (id) => {
    try {
      setError("");
      setStatus("");

      const updatedMessage = await api.patch(
        `${endpoints.messages}/${id}/read`,
        token
      );

      setMessages((prev) =>
        prev.map((message) =>
          message._id === id
            ? updatedMessage
            : message
        )
      );

      setSelectedMessage((prev) =>
        prev?._id === id
          ? updatedMessage
          : prev
      );

      setStatus("Message marked as read.");
    } catch (error) {
      console.error(
        "Failed to mark message as read:",
        error
      );

      setError(
        error.message ||
          "Failed to mark message as read."
      );
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setStatus("");

      await api.delete(
        `${endpoints.messages}/${id}`,
        token
      );

      setMessages((prev) =>
        prev.filter((message) => message._id !== id)
      );

      if (selectedMessage?._id === id) {
        setSelectedMessage(null);
      }

      setStatus("Message deleted successfully.");
    } catch (error) {
      console.error(
        "Failed to delete message:",
        error
      );

      setError(
        error.message ||
          "Failed to delete message."
      );
    }
  };

  // =========================
  // OPEN MESSAGE
  // =========================
  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);

    if (!message.isRead) {
      await handleMarkAsRead(message._id);
    }
  };

  const unreadCount = messages.filter(
    (message) => !message.isRead
  ).length;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">

        {/* =========================
            HEADER
        ========================= */}
        <div className="mb-8">

          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            Portfolio Management
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold mt-2">
                Messages
              </h1>

              <p className="text-gray-500 mt-2">
                View and manage messages sent through
                your portfolio contact form.
              </p>

            </div>

            <div className="bg-black text-white px-5 py-3 rounded-xl">

              <p className="text-xs text-gray-300">
                Unread
              </p>

              <p className="text-2xl font-bold mt-1">
                {unreadCount}
              </p>

            </div>

          </div>

        </div>

        {/* =========================
            STATUS
        ========================= */}
        {status && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-700">
            {status}
          </div>
        )}

        {/* =========================
            ERROR
        ========================= */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            LOADING
        ========================= */}
        {loading ? (

          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

            <p className="text-gray-500">
              Loading messages...
            </p>

          </div>

        ) : messages.length === 0 ? (

          /* =========================
             EMPTY
          ========================= */
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">

            <div className="text-4xl mb-4">
              ✉
            </div>

            <h2 className="text-xl font-semibold">
              No messages yet
            </h2>

            <p className="text-gray-500 mt-2">
              Messages submitted through your
              portfolio contact form will appear here.
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">

            {/* =========================
                MESSAGE LIST
            ========================= */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

              <div className="px-6 py-5 border-b border-gray-200">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-lg font-semibold">
                      Inbox
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {messages.length} message
                      {messages.length !== 1
                        ? "s"
                        : ""}
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={loadMessages}
                    className="text-sm font-medium hover:underline"
                  >
                    Refresh
                  </button>

                </div>

              </div>

              <div className="divide-y divide-gray-200">

                {messages.map((message) => (

                  <button
                    key={message._id}
                    type="button"
                    onClick={() =>
                      handleOpenMessage(message)
                    }
                    className={`w-full text-left p-5 hover:bg-gray-50 transition ${
                      selectedMessage?._id ===
                      message._id
                        ? "bg-gray-50"
                        : ""
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <div
                        className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                          message.isRead
                            ? "bg-gray-300"
                            : "bg-black"
                        }`}
                      />

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <h3
                            className={`truncate ${
                              message.isRead
                                ? "font-medium"
                                : "font-bold"
                            }`}
                          >
                            {message.name}
                          </h3>

                          <span className="text-xs text-gray-400 whitespace-nowrap">
                            {new Date(
                              message.createdAt
                            ).toLocaleDateString()}
                          </span>

                        </div>

                        <p className="text-sm text-gray-500 mt-1 truncate">
                          {message.email}
                        </p>

                        <p
                          className={`text-sm mt-2 truncate ${
                            message.isRead
                              ? "text-gray-600"
                              : "text-black font-medium"
                          }`}
                        >
                          {message.subject}
                        </p>

                        <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                          {message.message}
                        </p>

                      </div>

                    </div>

                  </button>

                ))}

              </div>

            </div>

            {/* =========================
                MESSAGE DETAILS
            ========================= */}
            <div className="bg-white border border-gray-200 rounded-2xl">

              {!selectedMessage ? (

                <div className="h-full min-h-[400px] flex items-center justify-center p-10 text-center">

                  <div>

                    <div className="text-4xl mb-4">
                      ←
                    </div>

                    <h2 className="text-xl font-semibold">
                      Select a message
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Select a message from your inbox
                      to view its details.
                    </p>

                  </div>

                </div>

              ) : (

                <div>

                  {/* DETAILS HEADER */}
                  <div className="p-6 border-b border-gray-200">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-sm text-gray-500">
                          From
                        </p>

                        <h2 className="text-2xl font-bold mt-1">
                          {selectedMessage.name}
                        </h2>

                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-sm text-gray-500 hover:text-black hover:underline mt-1 inline-block"
                        >
                          {selectedMessage.email}
                        </a>

                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          selectedMessage.isRead
                            ? "bg-gray-100 text-gray-600"
                            : "bg-black text-white"
                        }`}
                      >
                        {selectedMessage.isRead
                          ? "Read"
                          : "Unread"}
                      </span>

                    </div>

                  </div>

                  {/* MESSAGE CONTENT */}
                  <div className="p-6">

                    <div className="mb-6">

                      <p className="text-sm text-gray-500">
                        Subject
                      </p>

                      <h3 className="text-xl font-semibold mt-1">
                        {selectedMessage.subject}
                      </h3>

                    </div>

                    <div className="mb-6">

                      <p className="text-sm text-gray-500 mb-2">
                        Received
                      </p>

                      <p className="text-sm text-gray-700">
                        {new Date(
                          selectedMessage.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500 mb-2">
                        Message
                      </p>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">

                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="border-t border-gray-200 mt-7 pt-6 flex flex-wrap gap-3">

                      <a
                        href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(
                          `Re: ${selectedMessage.subject}`
                        )}`}
                        className="px-5 py-3 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition"
                      >
                        Reply via Email
                      </a>

                      {!selectedMessage.isRead && (
                        <button
                          type="button"
                          onClick={() =>
                            handleMarkAsRead(
                              selectedMessage._id
                            )
                          }
                          className="px-5 py-3 border border-gray-300 rounded-lg text-sm hover:border-black transition"
                        >
                          Mark as Read
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            selectedMessage._id
                          )
                        }
                        className="px-5 py-3 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        )}

      </div>
    </AdminLayout>
  );
}

export default AdminMessages;
