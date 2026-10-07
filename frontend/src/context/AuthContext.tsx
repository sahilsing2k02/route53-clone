"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  user: any;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check local storage for mock session
    const storedUser = localStorage.getItem("mock_aws_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else if (pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  const login = (email: string) => {
    const mockUser = { email, name: email.split("@")[0] };
    setUser(mockUser);
    localStorage.setItem("mock_aws_user", JSON.stringify(mockUser));
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_aws_user");
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
