import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : { id: null, name: '', email: '', phone: '' };
  });

  const login = (email, name = '', userData = {}) => {
    const newUser = {
      id:    userData.id    || null,
      name:  name || email.split('@')[0],
      email: email,
      phone: userData.phone || '',
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    localStorage.setItem("user_id", userData.id); 
  };

  const register = (name, email, phone) => {
    const newUser = { id: null, name, email, phone };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser({ id: null, name: '', email: '', phone: '' });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id"); 
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      localStorage.setItem("user", JSON.stringify(merged));
      if (updatedData.id) localStorage.setItem("user_id", updatedData.id); 
      return merged;
    });
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
