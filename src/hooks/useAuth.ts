import { useCallback, useEffect, useState } from "react";
import { getUserNameById } from "../utils/utils";

export function useAuth() {
  const [userName, setUserName] = useState("");

  // Faz login salvando o userId no sessionStorage
  const login = useCallback((id: string) => {
    sessionStorage.setItem("userId", id);
  }, []);

  const getUserId = useCallback((): string => {
    return sessionStorage.getItem("userId")
      ? String(sessionStorage.getItem("userId"))
      : "";
  }, []);

  // Faz logout removendo o userId do sessionStorage
  const logout = useCallback(() => {
    sessionStorage.removeItem("userId");
    setUserName("");
    window.location.href = "/";
  }, []);

  useEffect(() => {
    getUserNameById(getUserId()).then((name) => {
      setUserName(name);
    });
  }, []);

  // Verifica se está autenticado
  const isAuthenticated = !!getUserId();
  const userId = getUserId();

  return {
    userId,
    userName,
    isAuthenticated,
    login,
    logout,
  };
}
