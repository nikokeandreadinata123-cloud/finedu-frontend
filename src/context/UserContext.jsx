import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

function safeParse(key) {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === "undefined" || val === "null") return null;
    return JSON.parse(val);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = safeParse("user");
    return stored || { id: null, name: '', email: '', phone: '' };
  });

  // ✅ login() HANYA update React state, tidak touch localStorage
  // localStorage sudah dihandle oleh Login.jsx dan Register.jsx
  const login = (email, name = '', userData = {}) => {
    const newUser = {
      id:    userData.id    || null,
      name:  name || email.split('@')[0],
      email: email,
      phone: userData.phone || '',
    };
    setUser({ ...newUser });
  };

  const register = (name, email, phone) => {
    const newUser = { id: null, name, email, phone };
    setUser(newUser);
  };

  const logout = () => {
    setUser({ id: null, name: '', email: '', phone: '' });
    localStorage.clear();
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

