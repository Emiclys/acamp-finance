import { useCallback } from "react";

const validAdminId = "admin";

export function useAdminAuth() {
  // Faz login salvando o userId no sessionStorage
  const login = useCallback((id: string) => {
    if (id == validAdminId) {
      sessionStorage.setItem("adminId", id);
      location.href = "/admin";
    }
  }, []);

  const getAdminId = useCallback((): string => {
    return sessionStorage.getItem("adminId")
      ? String(sessionStorage.getItem("adminId"))
      : "";
  }, []);

  // Faz logout removendo o adminId do sessionStorage
  const logout = useCallback(() => {
    sessionStorage.removeItem("adminId");
    window.location.href = "/";
  }, []);

  return {
    validAdminId: validAdminId,
    adminId: getAdminId(),
    login,
    logout,
  };
}
