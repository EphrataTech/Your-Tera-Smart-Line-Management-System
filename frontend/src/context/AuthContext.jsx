import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Check if token has expiry and if it's still valid
        const tokenExpiry = localStorage.getItem('tokenExpiry');
        if (tokenExpiry && new Date().getTime() > parseInt(tokenExpiry)) {
          // Token expired, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('tokenExpiry');
        } else {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiry');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set token expiry to 24 hours from now
    const expiry = new Date().getTime() + (24 * 60 * 60 * 1000);
    localStorage.setItem('tokenExpiry', expiry.toString());
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    window.location.href = '/'; // Navigate to home page after logout
  };

  const isAdmin = () => {
    return user?.role === 'Admin';
  };

  const isCustomer = () => {
    return user?.role === 'Customer';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, isAdmin, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);