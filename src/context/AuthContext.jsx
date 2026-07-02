import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'https://e-learning-backend-8avx.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth headers for axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      setToken(data.token);
      const userObj = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        mobile: data.mobile || '',
        college: data.college || '',
        state: data.state || '',
        profileImage: data.profileImage || '',
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      setToken(data.token);
      const userObj = {
        id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
        mobile: data.mobile || '',
        college: data.college || '',
        state: data.state || '',
        profileImage: data.profileImage || '',
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return { success: true, user: userObj };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const googleLoginOrRegister = async (name, email, sub) => {
    // Attempt login first using the unique google ID (sub) as password
    const loginResult = await login(email, sub);
    if (loginResult.success) {
      return loginResult;
    }
    
    // If login fails (user doesn't exist), register the user automatically
    const registerResult = await register(name, email, sub, 'student');
    if (registerResult.success) {
      return registerResult;
    }

    return {
      success: false,
      message: registerResult.message || 'Google authentication failed',
    };
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, googleLoginOrRegister, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;

