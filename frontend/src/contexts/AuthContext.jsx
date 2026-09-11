import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );

  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD CURRENT USER
  // =====================================================

  useEffect(() => {

    const loadCurrentUser = async () => {

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {

        const response = await api.get("/auth/me");

        setUser(response.data);
        setIsAuthenticated(true);

      } catch (error) {

        console.error(
          "Unable to load current user:",
          error
        );

        setUser(null);
        setToken(null);
        setIsAuthenticated(false);

      } finally {

        setLoading(false);

      }

    };

    loadCurrentUser();

  }, [token]);


  // =====================================================
  // LOGIN
  // =====================================================

  const login = (jwtToken) => {

    localStorage.setItem(
      "access_token",
      jwtToken
    );

    setToken(jwtToken);

    setIsAuthenticated(true);

  };


  // =====================================================
  // LOGOUT
  // =====================================================

  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "medassist_profile"
    );

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);

  };


  return (

    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

}


export function useAuth() {

  return useContext(AuthContext);

}