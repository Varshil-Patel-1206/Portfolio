import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import api from "../services/api";
import { endpoints } from "../services/endpoints";

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

const getStoredAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem("admin") || "null");
  } catch {
    localStorage.removeItem("admin");
    return null;
  }
};

const clearStoredSession = () => {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [admin, setAdmin] = useState(getStoredAdmin);
  const [isCheckingAuth, setIsCheckingAuth] = useState(
    () => Boolean(localStorage.getItem("adminToken"))
  );

  useEffect(() => {
    let isCurrent = true;

    const validateSession = async () => {
      if (!token) {
        setAdmin(null);
        setIsCheckingAuth(false);
        return;
      }

      setIsCheckingAuth(true);

      try {
        const data = await api.get(endpoints.currentAdmin, token);

        if (isCurrent) {
          localStorage.setItem("admin", JSON.stringify(data.admin));
          setAdmin(data.admin);
        }
      } catch {
        if (isCurrent) {
          clearStoredSession();
          setToken(null);
          setAdmin(null);
        }
      } finally {
        if (isCurrent) {
          setIsCheckingAuth(false);
        }
      }
    };

    validateSession();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const login = (data) => {
    localStorage.setItem("adminToken", data.token);
    localStorage.setItem("admin", JSON.stringify(data.admin));

    setToken(data.token);
    setAdmin(data.admin);
  };

  const logout = () => {
    clearStoredSession();

    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        admin,
        login,
        logout,
        isAuthenticated: Boolean(token && admin),
        isCheckingAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
