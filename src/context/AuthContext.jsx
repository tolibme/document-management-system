import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

// Simple global logout reference
let globalLogout = null;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Check for saved tokens on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");
    
    if (savedUser && savedAccessToken && savedRefreshToken) {
      setUser(JSON.parse(savedUser));
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
    }
  }, []);

  // Login: save user and tokens
  const login = (userData, newAccessToken, newRefreshToken) => {
    console.log("Login: Saving user and tokens");
    
    setUser(userData);
    setAccessToken(newAccessToken);
    setRefreshToken(newRefreshToken);
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  };

  // Update access token after refresh
  const updateAccessToken = (newAccessToken) => {
    console.log("Updating access token after refresh");
    setAccessToken(newAccessToken);
    localStorage.setItem("accessToken", newAccessToken);
  };

  // Logout: clear everything and navigate to login
  const logout = () => {
    console.log("Logout: Clearing all data and navigating to login");
    
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    
    navigate("/login", { replace: true });
  };

  // Check if user is authenticated
  const isAuthenticated = !!(accessToken && refreshToken);

  // Set global logout for API interceptor
  globalLogout = logout;

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      refreshToken, 
      isAuthenticated,
      login, 
      logout,
      updateAccessToken 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export for API interceptor to call when tokens expire
export const logoutUser = () => {
  if (globalLogout) {
    console.log("API Interceptor: Calling logout due to expired tokens");
    globalLogout();
  }
};
