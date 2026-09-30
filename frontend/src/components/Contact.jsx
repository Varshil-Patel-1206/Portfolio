import { useState } from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      await api.post(endpoints.messages, form);

      setStatus(
        "Thanks for reaching out. I'll get back to you soon."
      );

      setForm({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setStatus(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-28 px-6 lg:px-8 bg-black text-white"
    >
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12 border-b border-white/20 pb-12">

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-gray-400 mb-5">
              Contact
            </p>

            <h2 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
              Let's build
              <br />
              something.
            </h2>
          </div>

          <div className="lg:pt-10">
            <p className="max-w-md text-gray-400 text-lg leading-relaxed">
              Have an idea, project or collaboration in mind?
              Send me a message and let's start a conversation.
            </p>
          </div>

        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-16 lg:gap-24 mt-16">

          {/* CONTACT INFO */}
          <div>

            <p className="text-xs uppercase tracking-widest text-gray-500 mb-8">
              Get in touch
            </p>

            <div className="space-y-7">

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <a
                  href="mailto:your-email@example.com"
                  className="mt-1 inline-block text-lg hover:text-gray-300 transition"
                >
                  your-email@example.com
                </a>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-1 text-lg">
                  Gujarat, India
                </p>
              </div>

            </div>

            {/* SOCIALS */}
            <div className="mt-12 pt-8 border-t border-white/20">

              <p className="text-xs uppercase tracking-widest text-gray-500 mb-5">
                Connect
              </p>

              <div className="flex flex-wrap gap-3">

                <a
                  href="https://github.com/Varshil-Patel-1206"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition"
                >
                  GitHub ↗
                </a>

                <a
                  href="https://www.linkedin.com/in/varshil-patel-a197b5331"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition"
                >
                  LinkedIn ↗
                </a>

                <a
                  href="https://www.instagram.com/cosmic.flair.3/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/20 rounded-full text-sm hover:bg-white hover:text-black transition"
                >
                  Instagram ↗
                </a>

              </div>

            </div>

          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit}>

            <div className="grid sm:grid-cols-2 gap-8">

              {/* NAME */}
              <div>
                <label className="text-sm text-gray-400">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                  className="mt-3 w-full bg-transparent border-b border-white/20 py-3 outline-none placeholder:text-gray-600 focus:border-white transition"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm text-gray-400">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="mt-3 w-full bg-transparent border-b border-white/20 py-3 outline-none placeholder:text-gray-600 focus:border-white transition"
                />
              </div>

            </div>

            {/* SUBJECT */}
            <div className="mt-8">

              <label className="text-sm text-gray-400">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What would you like to discuss?"
                required
                className="mt-3 w-full bg-transparent border-b border-white/20 py-3 outline-none placeholder:text-gray-600 focus:border-white transition"
              />

            </div>

            {/* MESSAGE */}
            <div className="mt-8">

              <label className="text-sm text-gray-400">
                Message
              </label>

              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows="5"
                required
                className="mt-3 w-full bg-transparent border-b border-white/20 py-3 outline-none resize-none placeholder:text-gray-600 focus:border-white transition"
              />

            </div>

            {/* STATUS */}
            {status && (
              <p className="mt-6 text-sm text-gray-300">
                {status}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 px-7 py-3.5 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message ↗"}
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;