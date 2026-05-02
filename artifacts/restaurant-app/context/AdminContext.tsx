import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => Promise<void>;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  setIsAdmin: async () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdminState] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("is_admin").then((v) => {
      if (v === "true") setIsAdminState(true);
    });
  }, []);

  async function setIsAdmin(val: boolean) {
    setIsAdminState(val);
    await AsyncStorage.setItem("is_admin", val ? "true" : "false");
  }

  return (
    <AdminContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
