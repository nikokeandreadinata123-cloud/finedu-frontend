import React, { createContext, useContext, useState } from "react";

const UserContext = createContext(null);

// ✅ Helper: safe JSON parse agar tidak crash jika value "undefined" atau rusak
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

  const login = (email, name = '', userData = {}) => {
    const newUser = {
      id:    userData.id    || null,
      name:  name || email.split('@')[0],
      email: email,
      phone: userData.phone || '',
    };

    // ✅ Clear semua data user lama dulu sebelum simpan user baru
    localStorage.clear();

    localStorage.setItem("user",    JSON.stringify(newUser));
    localStorage.setItem("user_id", String(userData.id ?? ""));

    setUser({ ...newUser });
  };

  const register = (name, email, phone) => {
    const newUser = { id: null, name, email, phone };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
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
