import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";
import { endpoints } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await api.post(
        endpoints.login,
        {
          email,
          password
        }
      );

      login(data);

      navigate(location.state?.from?.pathname || "/admin/dashboard", {
        replace: true
      });

    } catch (error) {
      setError(error.message || "Invalid email or password");
    }
  };

  return (
    <div className="admin-login min-h-screen flex items-center justify-center bg-gray-100 px-6">

      <form
        onSubmit={handleLogin}
        className="admin-login-card w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >

        <p className="admin-eyebrow text-center">
          COSMIC FLAIR / PRIVATE AREA
        </p>

        <h1 className="text-3xl font-bold text-center mt-3">
          Welcome back
        </h1>

        {error && (
          <p className="mt-4 text-red-500">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="admin-input w-full mt-6 p-3 border rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="admin-input w-full mt-4 p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="admin-primary w-full mt-6 bg-black text-white p-3 rounded-lg"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default AdminLogin;
