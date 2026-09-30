export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const api = {
  get: async (endpoint, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {})
      }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `GET request failed: ${response.status}`
      );
    }

    return data;
  },

  post: async (endpoint, data, token = null) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {})
      },
      body:
        data instanceof FormData
          ? data
          : JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `POST request failed: ${response.status}`
      );
    }

    return result;
  },

  put: async (endpoint, data, token) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        ...(data instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`
      },
      body:
        data instanceof FormData
          ? data
          : JSON.stringify(data)
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `PUT request failed: ${response.status}`
      );
    }

    return result;
  },

  patch: async (endpoint, token) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `PATCH request failed: ${response.status}`
      );
    }

    return result;
  },

  delete: async (endpoint, token) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        result.message || `DELETE request failed: ${response.status}`
      );
    }

    return result;
  }
};

export default api;
