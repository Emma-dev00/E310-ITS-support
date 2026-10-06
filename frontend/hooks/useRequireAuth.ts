"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface StoredUser {
  id: string;
  email: string;
  role: string;
  isFirstLogin?: boolean;
}

export function useRequireAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  return { isAuthenticated, user, isLoading };
}
