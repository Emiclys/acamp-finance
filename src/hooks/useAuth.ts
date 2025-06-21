import { useCallback, useEffect, useState } from "react";
import { getUserNameById } from "../utils/utils";

export function useAuth() {
  const [userName, setUserName] = useState("");

  // Faz login salvando o userId no localStorage
  const login = useCallback((id: string) => {
    localStorage.setItem("userId", id);
  }, []);

  const getUserId = useCallback((): string => {
    return localStorage.getItem("userId")
      ? String(localStorage.getItem("userId"))
      : "";
  }, []);

  // Faz logout removendo o userId do localStorage
  const logout = useCallback(() => {
    localStorage.removeItem("userId");
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
