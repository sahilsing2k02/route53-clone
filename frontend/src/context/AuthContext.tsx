"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem("mock_aws_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
      if (currentPath !== "/login" && currentPath !== "/") {
        router.push("/login");
      }
    }
  }, [router]);

  const login = (email: string) => {
    const mockUser = { email, name: email.split("@")[0] };
    setUser(mockUser);
    localStorage.setItem("mock_aws_user", JSON.stringify(mockUser));
    document.cookie = "mock_aws_session=true; path=/; max-age=86400";
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_aws_user");
    document.cookie = "mock_aws_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
