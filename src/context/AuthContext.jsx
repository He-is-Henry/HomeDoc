import { createContext, useEffect, useRef, useState } from "react";
import axios from "../api/axios";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const didRun = useRef(null);

  const login = (payload) => {
    setAccessToken(payload.accessToken);
    setId(payload.id);
    setName(payload.name);
  };
  setTimeout(() => {
    refreshToken();
  }, 15 * 60 * 1000);
  const refreshToken = async () => {
    setLoading(true);
    if (didRun.current) return;
    try {
      const res = await axios.get("/auth/refresh", { withCredentials: true });
      setLoading(false);
      setAccessToken(res.data.accessToken);
      setName(res.data.user.name);
      setId(res.data.user.id);
      didRun.current = true;
      return res.data.accessToken;
    } catch (err) {
      console.log(err);
      console.log("Refresh failed");
      setAccessToken(null); // Optional: force logout state
      return null;
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      const response = await axios.get("/auth/logout");
      console.log(response);
      setAccessToken(null);
      setName(null);
      setId(null);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (res) => res,
      async (err) => {
        const originalReq = err.config;

        if (
          (err.response?.status === 401 || err.response?.status === 403) &&
          !originalReq._retry
        ) {
          originalReq._retry = true;

          const newAccessToken = await refreshToken();
          if (newAccessToken) {
            originalReq.headers.Authorization = `Bearer ${newAccessToken}`;
            return axios(originalReq); // Retry the request
          }
        }

        return Promise.reject(err);
      }
    );

    // Try refresh once on load
    if (!didRun.current) {
      refreshToken(); // Don't check inside refreshToken
      didRun.current = true; // Set after calling
    }
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        setAccessToken,
        login,
        logout,
        name,
        loading,
        id,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
